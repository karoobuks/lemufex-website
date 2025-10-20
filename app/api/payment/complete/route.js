// import { NextResponse } from 'next/server';
// import { auth } from '@/app/api/auth/[...nextauth]/route';
// import connectedDB from '@/config/database';
// import Payment from '@/models/Payment';

// export async function POST(request) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { amount, courseId } = await request.json();

//     if (!amount || !courseId) {
//       return NextResponse.json({ error: 'Amount and course ID required' }, { status: 400 });
//     }

//     await connectedDB();

//     // Initialize Paystack payment
//     const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: session.user.email,
//         amount: amount * 100, // Convert to kobo
//         callback_url: `${process.env.NEXTAUTH_URL}/api/payment/verify`,
//         metadata: {
//           userId: session.user.id,
//           courseId,
//           paymentType: 'completion',
//           custom_fields: [
//             {
//               display_name: 'User ID',
//               variable_name: 'user_id',
//               value: session.user.id
//             }
//           ]
//         }
//       }),
//     });

//     const paystackData = await paystackResponse.json();

//     if (!paystackResponse.ok) {
//       return NextResponse.json({ 
//         error: paystackData.message || 'Payment initialization failed' 
//       }, { status: 400 });
//     }

//     // Create payment record
//     const payment = new Payment({
//       userId: session.user.id,
//       course: courseId,
//       amount,
//       email: session.user.email,
//       paymentType: 'installment',
//       currentInstallment: 2, // This is the completion payment
//       reference: paystackData.data.reference,
//       status: 'pending'
//     });

//     await payment.save();

//     return NextResponse.json({
//       authorization_url: paystackData.data.authorization_url,
//       reference: paystackData.data.reference
//     });

//   } catch (error) {
//     console.error('Error initiating payment completion:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import { auth } from "@/app/api/auth/[...nextauth]/route";
// import connectedDB from "@/config/database";
// import Payment from "@/models/Payment";
// import getRedis from "@/lib/redis"; // ✅ your redis setup file

// // Optional: create unique Redis key prefix
// const RATE_LIMIT_PREFIX = "payment_complete_rate:";

// // 1 request per 5 seconds per user
// const RATE_LIMIT_WINDOW = 5; 

// export async function POST(request) {
//   try {
//     console.log('Payment complete API called');
    
//     const session = await auth();
//     console.log('Session:', session?.user?.id ? 'Valid' : 'Invalid');
    
//     if (!session?.user?.id || !session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.user.id;
//     const rateKey = `${RATE_LIMIT_PREFIX}${userId}`;

//     // Temporarily disable Redis rate limiting
//     console.log('Skipping Redis rate limiting for debugging');

//     // ✅ Parse request body
//     const { amount, courseId } = await request.json();
//     console.log('Request data:', { amount, courseId });
    
//     if (!amount || !courseId) {
//       return NextResponse.json(
//         { error: "Amount and course ID required" },
//         { status: 400 }
//       );
//     }

//     // ✅ Connect to MongoDB (pooled connection)
//     await connectedDB();

//     // ✅ Initialize Paystack payment
//     const paystackResponse = await fetch(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: session.user.email,
//           amount: amount * 100, // convert to kobo
//           callback_url: `${process.env.NEXTAUTH_URL}/api/payment/verify`,
//           metadata: {
//             userId,
//             courseId,
//             paymentType: "completion",
//           },
//         }),
//       }
//     );

//     const paystackData = await paystackResponse.json();

//     if (!paystackResponse.ok || !paystackData?.status) {
//       console.error("❌ Paystack init error:", paystackData);
//       return NextResponse.json(
//         { error: paystackData.message || "Payment initialization failed" },
//         { status: 400 }
//       );
//     }

//     // ✅ Create payment record
//     const payment = await Payment.create({
//       userId,
//       course: courseId,
//       amount,
//       email: session.user.email,
//       paymentType: "completion",
//       currentInstallment: 2, // second or completion installment
//       reference: paystackData.data.reference,
//       status: "pending",
//     });

//     // ✅ Return success response
//     return NextResponse.json(
//       {
//         authorizationUrl: paystackData.data.authorization_url,
//         reference: payment.reference,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("❌ Payment completion error:", error);
//     console.error('Error stack:', error.stack);
//     return NextResponse.json(
//       { error: "Internal server error", details: error.message },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import connectedDB from "@/config/database";
import Payment from "@/models/Payment";

export async function POST(request) {
  try {
    console.log("✅ Payment complete API called");

    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, courseId } = await request.json();

    if (!amount || !courseId) {
      return NextResponse.json(
        { error: "Amount and course ID required" },
        { status: 400 }
      );
    }

    await connectedDB();

    // 🧩 Normalize courseId to ObjectId string if courseId is an object
    // 🧩 Always ensure courseId is a clean string ID
    let normalizedCourseId;

    try {
      if (typeof courseId === "object" && courseId !== null) {
        // Handle when courseId is a course object
        normalizedCourseId = courseId._id?.toString() || courseId.id?.toString();
      } else {
        // Handle when courseId is already a string or number
        normalizedCourseId = courseId?.toString();
      }
    } catch (e) {
      console.error("CourseId normalization error:", e);
      normalizedCourseId = String(courseId);
    }


    // 🧩 Initialize Paystack payment
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          amount: amount * 100, // Paystack uses kobo
          callback_url: `${process.env.NEXTAUTH_URL}/api/payment/verify`,
          metadata: {
            userId: session.user.id,
            courseId: normalizedCourseId,
            paymentType: "completion",
          },
        }),
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData?.data?.authorization_url) {
      console.error("❌ Paystack init failed:", paystackData);
      return NextResponse.json(
        { error: paystackData?.message || "Paystack initialization failed" },
        { status: 400 }
      );
    }

    // ✅ Create payment record
    const payment = await Payment.create({
      userId: session.user.id,
      course: normalizedCourseId?.toString(), // ✅ ensured to be string/ObjectId
      amount,
      email: session.user.email,
      paymentType: "completion", // ✅ valid since schema allows it
      currentInstallment: 2,
      reference: paystackData.data.reference,
      status: "pending",
    });

    console.log("✅ Payment created:", payment._id);

    // 🟢 Return payment URL
    return NextResponse.json(
      {
        authorizationUrl: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Payment completion error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
