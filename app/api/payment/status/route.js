// import { NextResponse } from 'next/server';
// import { auth } from '@/app/api/auth/[...nextauth]/route';
// import connectedDB from '@/config/database';
// import Payment from '@/models/Payment';
// import Trainee from '@/models/Trainee';

// export async function GET(request) {
//   try {
//     await connectedDB();
    
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
    
//     // Add mobile-friendly headers
//     const headers = {
//       'Content-Type': 'application/json',
//       'Cache-Control': 'no-cache, no-store, must-revalidate',
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET',
//       'Access-Control-Allow-Headers': 'Content-Type'
//     };

//     // Get all payments for this user (including pending)
//     const payments = await Payment.find({ 
//       userId: session.user.id
//     }).populate('course').sort({ paidAt: -1 });

//     if (payments.length === 0) {
//       return NextResponse.json(null);
//     }

//     // Get successful payments only for calculation
//     const successfulPayments = payments.filter(p => ['success', 'completed'].includes(p.status));
//     const totalPaid = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);
//     const latestPayment = payments[0];
    
//     // Get course details
//     const courseId = latestPayment.course?._id || latestPayment.course;
    
//     // Default course prices
//     const coursePrices = {
//       'Automation': { full: 150000, installment: 80000 },
//       'Electrical Engineering': { full: 120000, installment: 65000 },
//       'Software Programming': { full: 100000, installment: 55000 }
//     };

//     // Determine track from course or payment
//     let track = 'Software Programming';
//     if (latestPayment.course?.name) {
//       track = latestPayment.course.name;
//     }
    
//     const paymentType = latestPayment.paymentType || 'installment';
    
//     // For installment payments, total amount is the full course price
//     let totalAmount;
//     if (paymentType === 'installment') {
//       totalAmount = coursePrices[track]?.full || coursePrices['Software Programming'].full;
//     } else {
//       totalAmount = coursePrices[track]?.full || coursePrices['Software Programming'].full;
//     }
    
//     const pendingAmount = Math.max(0, totalAmount - totalPaid);
//     const isCompleted = pendingAmount === 0;

//     const response = NextResponse.json({
//       totalAmount,
//       paidAmount: totalPaid,
//       pendingAmount,
//       paymentType,
//       isCompleted,
//       courseId,
//       track,
//       payments: payments.map(p => ({
//         amount: p.amount,
//         paidAt: p.paidAt,
//         reference: p.reference,
//         status: p.status
//       }))
//     });
    
//     Object.entries(headers).forEach(([key, value]) => {
//       response.headers.set(key, value);
//     });
    
//     return response;

//   } catch (error) {
//     console.error('Error fetching payment status:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }


// app/api/payment/status/route.js
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import connectedDB from "@/config/database";
import Payment from "@/models/Payment";
import Course from "@/models/Course";
import getRedis from "@/lib/redis";
import mongoose from "mongoose";

const redis = getRedis();
const CACHE_TTL_SECONDS = 10; // short cache to reduce repeated load (tunable)

export async function GET(request) {
  try {
    await connectedDB();

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id.toString();
    const cacheKey = `payment_status:v1:${userId}`;

    // Try Redis cache first (very short lived)
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const res = NextResponse.json(parsed);
        res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
        res.headers.set("Content-Type", "application/json");
        return res;
      }
    } catch (err) {
      // non-fatal: log and continue to DB
      console.warn("Redis read failed:", err?.message || err);
    }

    // Single efficient aggregation:
    // - facet totals (sum of successful payments)
    // - recent payments (limit 20)
    // - latest payment summary
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const agg = await Payment.aggregate([
      { $match: { userId: userObjectId } },
      {
        $facet: {
          successfulTotals: [
            { $match: { status: { $in: ["success", "completed"] } } },
            { $group: { _id: null, totalPaid: { $sum: "$amount" } } },
          ],
          recentPayments: [
            { $sort: { paidAt: -1, createdAt: -1 } },
            { $limit: 20 },
            {
              $project: {
                _id: 1,
                amount: 1,
                paidAt: 1,
                reference: 1,
                status: 1,
                paymentType: 1,
                course: 1,
                createdAt: 1,
              },
            },
          ],
          latestPayment: [
            { $sort: { paidAt: -1, createdAt: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 1,
                amount: 1,
                paidAt: 1,
                reference: 1,
                status: 1,
                paymentType: 1,
                course: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]).allowDiskUse(true);

    const result = agg && agg[0] ? agg[0] : { successfulTotals: [], recentPayments: [], latestPayment: [] };
    const totalPaid = (result.successfulTotals[0]?.totalPaid) || 0;
    const recentPayments = result.recentPayments || [];
    const latestPayment = (result.latestPayment && result.latestPayment[0]) || null;

    // Get course details and admin-controlled prices
    let track = "Software Programming";
    let courseId = null;
    let totalAmount = 100000; // fallback
    
    if (latestPayment && latestPayment.course) {
      courseId = latestPayment.course;
      try {
        const course = await Course.findById(courseId).lean();
        if (course) {
          track = course.name;
          totalAmount = course.prices?.full || 100000;
        }
      } catch (err) {
        console.warn("Failed to fetch course:", err?.message);
      }
    }

    const paymentType = latestPayment?.paymentType || "installment";

    const pendingAmount = Math.max(0, totalAmount - totalPaid);
    const isCompleted = pendingAmount === 0;

    // Build compact response
    const payload = {
      totalAmount,
      paidAmount: totalPaid,
      pendingAmount,
      paymentType,
      isCompleted,
      courseId,
      track,
      payments: recentPayments.map((p) => ({
        id: p._id.toString(),
        amount: p.amount,
        paidAt: p.paidAt,
        reference: p.reference,
        status: p.status,
        paymentType: p.paymentType,
        course: p.course,
        createdAt: p.createdAt,
      })),
    };

    // Cache response briefly (non-critical)
    try {
      await redis.set(cacheKey, JSON.stringify(payload), "EX", CACHE_TTL_SECONDS);
    } catch (err) {
      // ignore caching errors
    }

    const response = NextResponse.json(payload);
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Content-Type", "application/json");
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
