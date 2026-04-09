import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Newsletter from "@/models/Newsletter";
import { sendEmail, sendWelcomeEmail } from "@/utils/mailer";

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
    }

    await connectDB();

    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      if (subscriber.status === "unsubscribed") {
        subscriber.status = "active";
        subscriber.unsubscribedAt = null;
        await subscriber.save();
      } else {
        return NextResponse.json({ message: "Already subscribed" }, { status: 400 });
      }
    } else {
      subscriber = await Newsletter.create({
        email,
        name: name || email.split("@")[0],
      });
    }

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;

    // Notify admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      "\uD83D\uDCE9 New Newsletter Signup",
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#081C3C;padding:24px;text-align:center;">
          <h1 style="color:#FE9900;margin:0;font-size:20px;">Lemufex Engineering</h1>
          <p style="color:#fff;margin:6px 0 0;font-size:13px;">New Newsletter Subscriber</p>
        </div>
        <div style="padding:24px;">
          <p style="color:#374151;"><strong>Email:</strong> ${email}</p>
          <p style="color:#374151;"><strong>Name:</strong> ${name || "Not provided"}</p>
        </div>
      </div>`
    );

    // Send branded welcome email to subscriber
    await sendWelcomeEmail(email, name || email.split("@")[0], unsubscribeUrl);

    return NextResponse.json({
      message: "Subscription successful! Check your email for confirmation.",
    });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { search, page = 1, limit = 10 } = Object.fromEntries(req.nextUrl.searchParams);

    const query = search
      ? { $or: [{ email: { $regex: search, $options: "i" } }, { name: { $regex: search, $options: "i" } }] }
      : {};

    const total = await Newsletter.countDocuments(query);
    const subscribers = await Newsletter.find(query)
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("email name status subscribedAt unsubscribedAt");

    const stats = {
      total,
      active: await Newsletter.countDocuments({ status: "active" }),
      unsubscribed: await Newsletter.countDocuments({ status: "unsubscribed" }),
    };

    return NextResponse.json({ subscribers, stats, total, currentPage: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
