
// app/api/payment/initiate/route.js
import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Payment from "@/models/Payment";
import Course from "@/models/Course";

export async function POST(req) {
  try {
    await connectedDB();

    const body = await req.json();
    const { userId, email, slug, paymentType } = body;

    if (!userId || !email || !slug || !paymentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    
    // 1. Fetch course
    const course = await Course.findOne({ slug: new RegExp(`^${slug}$`, "i") });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 2. Determine amount + amountDue
    let amount = 0;
    let installment = 0;
    let amountDue = 0;

    if (paymentType === "full") {
      amount = course.prices.full;
      installment = 0;
      amountDue = 0
    } else if (paymentType === "installment") {
      amount = course.prices.installment;
      installment = 1; // first installment
      amountDue = Math.max(course.prices.full - course.prices.installment, 0);
    } else {
      return NextResponse.json(
        { error: "Invalid payment type" },
        { status: 400 }
      );
    }

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

    // 3. Initialize Paystack FIRST
    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Paystack expects kobo
          callback_url: `${process.env.NEXT_PUBLIC_DOMAIN}/payment/verify?userId=${userId}&paymentId=${payment._id}`,
          metadata: {
            userId,
            slug,
            paymentId: payment._id,
            paymentType,
          },
          subaccount: "ACCT_7uaelri8mebma39",
        }),
      }
    );

    const data = await paystackRes.json();

    if (!data.status) {
      return NextResponse.json(
        { error: "Failed to initialize payment", details: data },
        { status: 400 }
      );
    }

       await Payment.findByIdAndUpdate(payment._id, {
      reference: data.data.reference,
    });

    // 5. Return auth URL to frontend
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
