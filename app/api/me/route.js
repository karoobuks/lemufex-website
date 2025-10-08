
// // /api/me/route.js
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utils/authOptions";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import connectedDB from "@/config/database";
// import User from "@/models/User";
// import Trainee from "@/models/Trainee";

// export const dynamic = "force-dynamic";

// export async function GET() {
//   await connectedDB();

//   try {
//     let user = null;

//     // 1. Try next-auth session
//     const session = await getServerSession(authOptions);
//     if (session?.user?.email) {
//       user = await User.findOne({ email: session.user.email });
//     }

//     // 2. Try JWT cookie if no session user
//     if (!user) {
//       const cookieStore = await cookies()
//       const token = cookieStore.get("token")?.value;
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         user = await User.findById(decoded.id);
//       }
//     }

//     // 3. No user → 401
//     if (!user) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }

//      // ✅ Lookup trainee profile if exists
//     let trainee = null;
//     if (user.isTrainee) {
//       trainee = await Trainee.findOne({ user: user._id }).lean();
//     }

//     // ✅ Explicitly construct safe JSON
//     const safeUser = {
//       id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       provider: user.provider || "credentials", 
//       isTrainee: user.isTrainee,
//       // trainee: user.trainee ? {
//       //   id: user.trainee._id,
//       //   program: user.trainee.program,
//       //   startDate: user.trainee.startDate,
//       //   progress: user.trainee.progress,
//       //   // add only the fields you actually want to expose 👇
//       //   // e.g. level, cohort, mentor, etc.
//       // } : null,
//         trainee: trainee
//         ? {
//             id: trainee._id,
//             fullName: trainee.fullName,
//             trainings: trainee.trainings,
//             progress: trainee.progress,
//           }
//         : null,
//       createdAt: user.createdAt,
//       status: user.status || "Active",
//       hasPassword: !!user.password, // 👈 manual users = true, Google users = false
//       provider: user.provider || "credentials", // fallback
//     };

//     return Response.json(safeUser, { status: 200 });

//   } catch (err) {
//     console.error("❌ Error in /api/me:", err);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// // /api/me/route.js
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utils/authOptions";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import connectedDB from "@/config/database";
// import User from "@/models/User";
// import Trainee from "@/models/Trainee";
// import Course from "@/models/Course";

// export const dynamic = "force-dynamic";

// export async function GET() {
//   await connectedDB();

//   try {
//     let user = null;

//     // 1. Try next-auth session
//     const session = await getServerSession(authOptions);
//     if (session?.user?.email) {
//       user = await User.findOne({ email: session.user.email });
//     }

//     // 2. Try JWT cookie if no session user
//     if (!user) {
//       const cookieStore = await cookies();
//       const token = cookieStore.get("token")?.value;
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         user = await User.findById(decoded.id);
//       }
//     }

//     // 3. No user → 401
//     if (!user) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // ✅ Lookup trainee profile if exists
//     let trainee = null;
//     let courseDetails = null;

//     if (user.isTrainee) {
//       trainee = await Trainee.findOne({ user: user._id }).lean();

//       if (trainee?.trainings?.length > 0) {
//         const track = trainee.trainings[0].track; // assume 1st training = active one
//         courseDetails = await Course.findOne({ name: track }).lean();
//       }
//     }

//     // ✅ Explicitly construct safe JSON
//     const safeUser = {
//       id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       provider: user.provider || "credentials",
//       isTrainee: user.isTrainee,
//       trainee: trainee
//         ? {
//             id: trainee._id,
//             fullName: trainee.fullName,
//             trainings: trainee.trainings,
//             course: courseDetails
//               ? {
//                   name: courseDetails.name,
//                   price: courseDetails.price,
//                   description: courseDetails.description,
//                 }
//               : null,
//           }
//         : null,
//       createdAt: user.createdAt,
//       status: user.status || "Active",
//       hasPassword: !!user.password,
//     };

//     return Response.json(safeUser, { status: 200 });
//   } catch (err) {
//     console.error("❌ Error in /api/me:", err);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


// /api/me/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectedDB from "@/config/database";
import User from "@/models/User";
import Trainee from "@/models/Trainee";
import Course from "@/models/Course";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectedDB();

  try {
    let user = null;

    // 1. Session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      user = await User.findOne({ email: session.user.email });
    }

    // 2. JWT cookie
    if (!user) {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      }
    }

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Trainee & Course
    let trainee = null;
    let courseDetails = null;

    if (user.isTrainee) {
      trainee = await Trainee.findOne({ user: user._id }).lean();

      if (trainee?.trainings?.length > 0) {
        const track = trainee.trainings[0].track;
        courseDetails = await Course.findOne({ name: track }).lean();
      }
    }

    // 4. Construct response
    const reference = "LEM-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    return Response.json(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isTrainee: user.isTrainee,
        course: courseDetails?.name || null,   // 👈 now top-level
        amount: courseDetails?.price || 0,     // 👈 now top-level
        reference,                             // 👈 added for payments
        trainee: trainee
          ? {
              id: trainee._id,
              fullName: trainee.fullName,
              trainings: trainee.trainings,
            }
          : null,
             hasPassword: !!user.password,             // 👈 NEW
        provider: user.provider || "credentials",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error in /api/me:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
