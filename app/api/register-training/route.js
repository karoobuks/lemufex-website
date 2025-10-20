// // app/api/trainee/register/route.js
// import { NextResponse } from "next/server";
// import Trainee from "@/models/Trainee";
// import { getServerSession } from "next-auth";
// import User from "@/models/User";
// import connectedDB from "@/config/database";
// import { authOptions } from "@/utils/authOptions";
// import Course from "@/models/Course";
// import { trackPrices } from "@/utils/trackPrices";

// export async function POST(req) {
//   await connectedDB();
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const {
//       fullName,
//       email,
//       trainings,
//       phone,
//       address,
//       dob,
//       emergencycontact,
//       paymentPlan, // 👈 "full" or "installment" from frontend
//     } = await req.json();

//     const user = await User.findOneAndUpdate(
//       { email: session.user.email },
//       { isTrainee: true },
//       { new: true }
//     );

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const existingTrainee = await Trainee.findOne({ user: user._id });
//     if (existingTrainee) {
//       return NextResponse.json({ error: "Already registered as trainee" }, { status: 400 });
//     }

//     // ✅ Normalize trainings
//     let formattedTrainings = [];
//     if (typeof trainings === "string") {
//       formattedTrainings.push({ track: trainings });
//     } else if (Array.isArray(trainings)) {
//       formattedTrainings = trainings.map((track) =>
//         typeof track === "string" ? { track } : track
//       );
//     }

//     const enrichedTrainings = [];
//     for(let training of formattedTrainings) {
//       const course = await Course.findOne({name:training.track});

//       if(!course){
//         return NextResponse.json(
//           {error:`Course not found for track: ${training.track}`},
//           {status:400}
//         );
//       }
//       enrichedTrainings.push({
//         track:training.track,
//         course:course._id,
//         enrolledAt:new Date(),
//         totalModules: course.totalModules,
//         completedModules:0
//       })
//     }

//     // ✅ Get prices for first selected track
//     const primaryTrack = formattedTrainings[0]?.track;
//     const prices = trackPrices[primaryTrack];
//     if (!prices) {
//       return NextResponse.json({ error: "Invalid track selected" }, { status: 400 });
//     }

//     // ✅ Calculate payment details
//     let currentInstallment = 0;
//     let amountDue = 0;

//     if (paymentPlan === "full") {
//       currentInstallment = 0;
//       amountDue = 0; // They will pay the full amount at initiation
//     } else if (paymentPlan === "installment") {
//       currentInstallment = 1; // first installment to be paid
//       amountDue = prices.full - prices.installment; // balance left after first payment
//     }

//     // ✅ Create trainee
//     const newTrainee = await Trainee.create({
//       user: user._id,
//       fullName,
//       email,
//       trainings: enrichedTrainings,
//       phone,
//       address,
//       dob,
//       emergencycontact,
//       fullPrice: prices.full,
//       installmentPrice: prices.installment,
//       paymentType: paymentPlan,
//       currentInstallment,
//       amountDue,
//     });

//     user.isTrainee = true;
//     await user.save();

//     return NextResponse.json(
//       { success: "Trainee successfully registered", user: newTrainee },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log("❌ Registration error:", error);
//     return NextResponse.json(
//       { error: "Registration failed, something went wrong" },
//       { status: 500 }
//     );
//   }
// }



// app/api/trainee/register/route.js
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import connectedDB from "@/config/database";
import User from "@/models/User";
import Trainee from "@/models/Trainee";
import Course from "@/models/Course";
import getRedis from "@/lib/redis"; // ✅ must export Redis client
import mongoose from "mongoose";

// Config (tunable via env)
const WINDOW_MS = parseInt(process.env.TRAINEE_RATE_WINDOW_MS || "60000", 10);
const MAX_PER_IP = parseInt(process.env.TRAINEE_MAX_PER_IP || "5", 10);
const MAX_PER_USER = parseInt(process.env.TRAINEE_MAX_PER_USER || "2", 10);

function getClientIP(req) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req) {
  await connectedDB();
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis(); // ✅ correct usage
  const ip = getClientIP(req);
  const userEmail = String(session.user.email).toLowerCase();

  try {
    // Rate limiting
    const ipKey = `trainee:ip:${process.env.NODE_ENV}:${ip}`;
    const userKey = `trainee:user:${process.env.NODE_ENV}:${userEmail}`;

    const [ipCount, userCount] = await Promise.all([
      redis.incr(ipKey),
      redis.incr(userKey),
    ]);

    if (ipCount === 1) await redis.pexpire(ipKey, WINDOW_MS);
    if (userCount === 1) await redis.pexpire(userKey, WINDOW_MS);

    if (ipCount > MAX_PER_IP) {
      return NextResponse.json({ error: "Too many trainee registrations from this IP. Try later." }, { status: 429 });
    }
    if (userCount > MAX_PER_USER) {
      return NextResponse.json({ error: "Too many trainee registrations for this account. Try later." }, { status: 429 });
    }

    // Parse and validate body
    const body = await req.json();
    const {
      fullName,
      trainings,
      phone,
      address,
      dob,
      emergencycontact,
      paymentPlan,
    } = body || {};

    if (!fullName || !trainings  || !dob || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // MongoDB transaction
    const sessionDB = await mongoose.startSession();
    sessionDB.startTransaction();

    try {
      const user = await User.findOneAndUpdate(
        { email: userEmail },
        { isTrainee: true },
        { new: true, session: sessionDB }
      );

      if (!user) {
        await sessionDB.abortTransaction();
        sessionDB.endSession();
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const existing = await Trainee.findOne({ user: user._id }).session(sessionDB);
      if (existing) {
        // If already exists, simply return existing instead of creating duplicate
        await sessionDB.commitTransaction();
        sessionDB.endSession();
        return NextResponse.json(
          { success: "Already registered", trainee: existing },
          { status: 200 }
        );
      }


      let formattedTrainings = [];
      if (typeof trainings === "string") {
        formattedTrainings.push({ track: trainings });
      } else if (Array.isArray(trainings)) {
        formattedTrainings = trainings.map((t) => (typeof t === "string" ? { track: t } : t));
      } else {
        await sessionDB.abortTransaction();
        sessionDB.endSession();
        return NextResponse.json({ error: "Invalid trainings format" }, { status: 400 });
      }

      const courseDocs = await Promise.all(
        formattedTrainings.map((t) => Course.findOne({ name: t.track }).lean())
      );

      const enrichedTrainings = formattedTrainings.map((t, idx) => {
        const course = courseDocs[idx];
        if (!course) throw new Error(`Course not found for track: ${t.track}`);
        return {
          track: t.track,
          course: course._id,
          enrolledAt: new Date(),
          totalModules: course.totalModules,
          completedModules: 0,
        };
      });

      const primaryTrack = formattedTrainings[0]?.track;
      const primaryCourse = courseDocs[0];
      if (!primaryCourse?.prices) throw new Error("Course prices not configured");
      const prices = primaryCourse.prices;

      // let currentInstallment = 0;
      // let amountDue = 0;
      // if (paymentPlan === "full") {
      //   currentInstallment = 0;
      //   amountDue = 0;
      // } else if (paymentPlan === "installment") {
      //   currentInstallment = 1;
      //   amountDue = prices.full - prices.installment;
      // } else {
      //   throw new Error("Invalid payment plan");
      // }
      // Skip payment setup for now — handled on payment page
      const paymentPlan = null;
      const currentInstallment = 0;
      const amountDue = prices.full; // default full price pending payment


      const created = await Trainee.create(
        [
          {
            user: user._id,
            fullName,
            email: userEmail,
            trainings: enrichedTrainings,
            phone,
            address,
            dob,
            emergencycontact,
            fullPrice: prices.full,
            installmentPrice: prices.installment,
            paymentType: paymentPlan,
            currentInstallment,
            amountDue,
          },
        ],
        { session: sessionDB }
      );

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      return NextResponse.json(
        { success: "Trainee successfully registered", trainee: created[0] },
        { status: 201 }
      );
    } catch (innerErr) {
      await sessionDB.abortTransaction();
      sessionDB.endSession();

      if (innerErr.message?.startsWith("Course not found")) {
        return NextResponse.json({ error: innerErr.message }, { status: 400 });
      }
      if (innerErr?.code === 11000) {
        return NextResponse.json({ error: "Already registered as trainee" }, { status: 409 });
      }

      console.error("Trainee registration inner error:", innerErr);
      return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("Trainee registration error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
