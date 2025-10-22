

// // app/api/payment/status/route.js
// import { NextResponse } from "next/server";
// import { auth } from "@/app/api/auth/[...nextauth]/route";
// import connectedDB from "@/config/database";
// import Payment from "@/models/Payment";
// import mongoose from "mongoose";
// import getRedis from "@/lib/redis";

// const redis = getRedis();
// const CACHE_TTL_SECONDS = 10;

// export async function GET() {
//   try {
//     await connectedDB();
//     const session = await auth();

//     if (!session?.user?.id && !session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Build userId ObjectId if valid
//     const maybeUserId =
//       session?.user?.id && mongoose.Types.ObjectId.isValid(String(session.user.id))
//         ? new mongoose.Types.ObjectId(String(session.user.id))
//         : null;

//     const cacheKey = `payment_status:v6:${session.user?.id || session.user?.email}`;

//     // 1) Try Redis cache
//     try {
//       const cached = await redis.get(cacheKey);
//       if (cached) {
//         const parsed = JSON.parse(cached);
//         return NextResponse.json(parsed, {
//           headers: { "Cache-Control": "no-cache" },
//         });
//       }
//     } catch (err) {
//       console.warn("Redis read failed:", err?.message || err);
//     }

//     // 2) Match payments by userId OR email (safe fallback)
//     //    Only include successful/completed payments for paid amount calc
//     const match = {
//       status: { $in: ["success", "completed", "Success", "SUCCESS"] },
//     };
//     if (maybeUserId) {
//       match.$or = [{ userId: maybeUserId }, { email: session.user.email }];
//     } else {
//       match.email = session.user.email;
//     }

//     // 3) Aggregate by course (supports course as ObjectId reference)
//     const agg = await Payment.aggregate([
//       { $match: match },
//       {
//         // lookup course by the `course` ObjectId (works when course is stored as ObjectId)
//         $lookup: {
//           from: "courses",
//           localField: "course",
//           foreignField: "_id",
//           as: "courseData",
//         },
//       },
//       {
//         // courseInfo = first courseData if present, otherwise keep the raw course value
//         $addFields: {
//           courseInfo: {
//             $ifNull: [{ $arrayElemAt: ["$courseData", 0] }, "$course"],
//           },
//         },
//       },
//       {
//         // Group by the resolved course id (either courseInfo._id or the raw course ObjectId)
//         $group: {
//           _id: { $ifNull: ["$courseInfo._id", "$course"] },
//           course: { $first: "$courseInfo" },
//           totalPaid: { $sum: "$amount" },
//           latestPayment: { $last: "$$ROOT" },
//         },
//       },
//       {
//         // Sort groups by latestPayment.createdAt desc (optional)
//         $sort: { "latestPayment.createdAt": -1 },
//       },
//     ]).allowDiskUse(true);

//     if (!agg || agg.length === 0) {
//       return NextResponse.json({
//         message: "No payment information available",
//         courses: [],
//       });
//     }

//     // 4) Build clean response using course.price.full when available
//     const courseSummaries = agg.map((entry) => {
//       const courseObj = entry.course || {};
//       // If lookup found a course doc, prices likely at courseObj.prices.full
//       const totalAmount = (courseObj && courseObj.prices && courseObj.prices.full) || 0;
//       const paid = entry.totalPaid || 0;
//       const pending = Math.max(0, totalAmount - paid);

//       return {
//         courseId: entry._id ? String(entry._id) : null,
//         track: courseObj?.name || courseObj?.title || "Unknown Course",
//         totalAmount,
//         paidAmount: paid,
//         pendingAmount: pending,
//         paymentType: entry.latestPayment?.paymentType || "installment",
//         currentInstallment: entry.latestPayment?.currentInstallment || 1,
//         amountDue: typeof entry.latestPayment?.amountDue === "number" ? entry.latestPayment.amountDue : pending,
//         isCompleted: pending <= 0,
//         lastPaidAt: entry.latestPayment?.paidAt || entry.latestPayment?.createdAt || null,
//         reference: entry.latestPayment?.reference || null,
//         status: entry.latestPayment?.status || null,
//       };
//     });

//     // 5) Summary totals
//     const totalPaidAll = courseSummaries.reduce((s, c) => s + (c.paidAmount || 0), 0);
//     const pendingAll = courseSummaries.reduce((s, c) => s + (c.pendingAmount || 0), 0);
//     const summary = {
//       totalCourses: courseSummaries.length,
//       totalPaidAll,
//       pendingAll,
//     };

//     const payload = {
//       userId: session.user?.id || session.user?.email,
//       courses: courseSummaries,
//       summary,
//     };

//     // 6) Cache briefly
//     try {
//       await redis.set(cacheKey, JSON.stringify(payload), "EX", CACHE_TTL_SECONDS);
//     } catch (err) {
//       console.warn("Redis cache set failed:", err?.message || err);
//     }

//     return NextResponse.json(payload, {
//       headers: {
//         "Cache-Control": "no-cache",
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching payment status:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }



// app/api/payment/status/route.js
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import connectedDB from "@/config/database";
import Payment from "@/models/Payment";
import mongoose from "mongoose";
import getRedis from "@/lib/redis";

const redis = getRedis();
const CACHE_TTL_SECONDS = 10;

export async function GET() {
  try {
    await connectedDB();
    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const maybeUserId =
      session?.user?.id && mongoose.Types.ObjectId.isValid(String(session.user.id))
        ? new mongoose.Types.ObjectId(String(session.user.id))
        : null;

    const cacheKey = `payment_status:v8:${session.user?.id || session.user?.email}`;

    // 1) Try Redis cache first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return NextResponse.json(parsed, {
          headers: { "Cache-Control": "no-cache" },
        });
      }
    } catch (err) {
      console.warn("Redis read failed:", err?.message || err);
    }

    // 2) Match payments
    const match = {
      status: { $in: ["success", "completed", "Success", "SUCCESS"] },
    };
    if (maybeUserId) {
      match.$or = [{ userId: maybeUserId }, { email: session.user.email }];
    } else {
      match.email = session.user.email;
    }

    // 3) Aggregate to get summary per course
    const agg = await Payment.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseData",
        },
      },
      {
        $addFields: {
          courseInfo: {
            $ifNull: [{ $arrayElemAt: ["$courseData", 0] }, "$course"],
          },
        },
      },
      {
        $group: {
          _id: { $ifNull: ["$courseInfo._id", "$course"] },
          course: { $first: "$courseInfo" },
          totalPaid: { $sum: "$amount" },
          latestPayment: { $last: "$$ROOT" },
        },
      },
      { $sort: { "latestPayment.createdAt": -1 } },
    ]).allowDiskUse(true);

    // 4) Return clean summaries
    const courseSummaries = (agg || []).map((entry) => {
      const courseObj = entry.course || {};
      const totalAmount =
        (courseObj?.prices?.full && Number(courseObj.prices.full)) || 0;
      const paid = entry.totalPaid || 0;
      const pending = Math.max(0, totalAmount - paid);

      return {
        courseId: entry._id ? String(entry._id) : null,
        track: courseObj?.name || courseObj?.title || "Unknown Course",
        totalAmount,
        paidAmount: paid,
        pendingAmount: pending,
        paymentType: entry.latestPayment?.paymentType || "installment",
        currentInstallment: entry.latestPayment?.currentInstallment || 1,
        amountDue:
          typeof entry.latestPayment?.amountDue === "number"
            ? entry.latestPayment.amountDue
            : pending,
        isCompleted: pending <= 0,
        lastPaidAt:
          entry.latestPayment?.paidAt ||
          entry.latestPayment?.createdAt ||
          null,
        reference: entry.latestPayment?.reference || null,
        status: entry.latestPayment?.status || null,
      };
    });

    // 5) Fetch raw payments list (for full history)
    const allPayments = await Payment.find(match)
      .sort({ createdAt: -1 })
      .lean();

    // 6) Summary totals
    const totalPaidAll = courseSummaries.reduce(
      (s, c) => s + (c.paidAmount || 0),
      0
    );
    const pendingAll = courseSummaries.reduce(
      (s, c) => s + (c.pendingAmount || 0),
      0
    );

    const summary = {
      totalCourses: courseSummaries.length,
      totalPaidAll,
      pendingAll,
    };

    const payload = {
      userId: session.user?.id || session.user?.email,
      courses: courseSummaries,
      payments: allPayments, // 👈 now included for frontend history
      summary,
    };

    // 7) Cache briefly
    try {
      await redis.set(cacheKey, JSON.stringify(payload), "EX", CACHE_TTL_SECONDS);
    } catch (err) {
      console.warn("Redis cache set failed:", err?.message || err);
    }

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
