
// // app/api/payment/initiate/route.js
// import { NextResponse } from "next/server";
// import connectedDB from "@/config/database";
// import Payment from "@/models/Payment";
// import Course from "@/models/Course";

// export async function POST(req) {
//   try {
//     await connectedDB();

//     const body = await req.json();
//     const { userId, email, slug, paymentType } = body;

//     if (!userId || !email || !slug || !paymentType) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

    
//     // 1. Fetch course
//     const course = await Course.findOne({ slug: new RegExp(`^${slug}$`, "i") });
//     if (!course) {
//       return NextResponse.json({ error: "Course not found" }, { status: 404 });
//     }

//     // 2. Determine amount + amountDue
//     let amount = 0;
//     let installment = 0;
//     let amountDue = 0;

//     if (paymentType === "full") {
//       amount = course.prices.full;
//       installment = 0;
//       amountDue = 0
//     } else if (paymentType === "installment") {
//       amount = course.prices.installment;
//       installment = 1; // first installment
//       amountDue = Math.max(course.prices.full - course.prices.installment, 0);
//     } else {
//       return NextResponse.json(
//         { error: "Invalid payment type" },
//         { status: 400 }
//       );
//     }

//     const payment = await Payment.create({
//       userId,
//       email,
//       course: course._id,
//       amount,
//       paymentType,
//       currentInstallment: installment,
//       amountDue,
//       status: "pending",
//     });

//     // 3. Initialize Paystack FIRST
//     const paystackRes = await fetch(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           amount: amount * 100, // Paystack expects kobo
//           callback_url: `${process.env.NEXTAUTH_URL}/api/payment/verify`,
//           metadata: {
//             userId,
//             slug,
//             paymentId: payment._id,
//             paymentType,
//           },
//           subaccount: "ACCT_7uaelri8mebma39",
//         }),
//       }
//     );

//     const data = await paystackRes.json();

//     if (!data.status) {
//       return NextResponse.json(
//         { error: "Failed to initialize payment", details: data },
//         { status: 400 }
//       );
//     }

//        await Payment.findByIdAndUpdate(payment._id, {
//       reference: data.data.reference,
//     });

//     // 5. Return auth URL to frontend
//     return NextResponse.json(
//       {
//         authorizationUrl: data.data.authorization_url,
//         paymentId: payment._id,
//         reference: data.data.reference,
//         course,
//         amountDue,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("❌ Payment initiation error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


// app/api/payment/initiate/route.js
import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Payment from "@/models/Payment";
import Course from "@/models/Course";
import getRedis from "@/lib/redis";

const redis = getRedis();

/** --- Redis Rate Limiter (5 requests per minute per user) --- */
async function rateLimit(userId) {
  const key = `rate:payment:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60);
  if (count > 5) return false;
  return true;
}

/** --- Safe Fetch with Retry --- */
async function safeFetch(url, options, retries = 2, timeoutMs = 10000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000)); // wait 1s before retry
    }
  }
}

export async function POST(req) {
  try {
    await connectedDB();

    const { userId, email, slug, paymentType } = await req.json();
    if (!userId || !email || !slug || !paymentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // --- 1️⃣ Rate limit check ---
    if (!(await rateLimit(userId))) {
      return NextResponse.json({ error: "Too many payment attempts. Try again later." }, { status: 429 });
    }

    // --- 2️⃣ Cached course lookup ---
    const cacheKey = `course:${slug}`;
    let cachedCourse = await redis.get(cacheKey);
    let course;

    if (cachedCourse) {
      course = JSON.parse(cachedCourse);
    } else {
      course = await Course.findOne({ slug: new RegExp(`^${slug}$`, "i") }).lean();
      if (!course) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }
      await redis.set(cacheKey, JSON.stringify(course), "EX", 300); // cache for 5 min
    }

    // --- 3️⃣ Prevent duplicate pending payments ---
    const existingPending = await Payment.findOne({ userId, course: course._id, status: "pending" });
    if (existingPending) {
      return NextResponse.json({
        error: "You already have a pending payment for this course.",
        reference: existingPending.reference,
      }, { status: 409 });
    }

    // --- 4️⃣ Determine payment amount ---
    let amount = 0, installment = 0, amountDue = 0;
    if (paymentType === "full") {
      amount = course.prices.full;
    } else if (paymentType === "installment") {
      amount = course.prices.installment;
      installment = 1;
      amountDue = Math.max(course.prices.full - course.prices.installment, 0);
    } else {
      return NextResponse.json({ error: "Invalid payment type" }, { status: 400 });
    }

    // --- 5️⃣ Create payment record ---
    const payment = await Payment.create({
      userId,
      email,
      course: course._id,
      amount,
      paymentType,
      currentInstallment: installment,
      amountDue,
      status: "pending",
    });

    // --- 6️⃣ Initialize Paystack securely ---
    const paystackPayload = {
      email,
      amount: amount * 100, // convert to kobo
      callback_url: `${process.env.NEXTAUTH_URL}/api/payment/verify`,
      metadata: { userId, slug, paymentId: payment._id, paymentType },
      subaccount: process.env.PAYSTACK_SUBACCOUNT,
    };

    const paystackHeaders = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    };

    const data = await safeFetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: paystackHeaders,
      body: JSON.stringify(paystackPayload),
    });

    if (!data?.status) {
      await Payment.findByIdAndUpdate(payment._id, { status: "failed" });
      return NextResponse.json({ error: "Failed to initialize payment", details: data }, { status: 400 });
    }

    // --- 7️⃣ Update payment record ---
    await Payment.findByIdAndUpdate(payment._id, {
      reference: data.data.reference,
    });

    // --- 8️⃣ Respond to client ---
    return NextResponse.json(
      {
        authorizationUrl: data.data.authorization_url,
        paymentId: payment._id,
        reference: data.data.reference,
        course,
        amountDue,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Payment initiation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
