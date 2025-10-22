// import { NextResponse } from "next/server";
// import connectedDB from "@/config/database";
// import Newsletter from "@/models/Newsletter";

// export async function GET(req) {
//   try {
//     await connectedDB();
//     const { searchParams } = new URL(req.url);
//     const token = searchParams.get("token");

//     if (!token)
//       return NextResponse.json({ message: "Invalid unsubscribe link" }, { status: 400 });

//     const subscriber = await Newsletter.findOne({ unsubscribeToken: token });
//     if (!subscriber)
//       return NextResponse.json({ message: "Subscriber not found" }, { status: 404 });

//     subscriber.status = "unsubscribed";
//     subscriber.unsubscribedAt = new Date();
//     await subscriber.save();

//     return NextResponse.json({
//       message: `You have successfully unsubscribed ${subscriber.email}`,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }




import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import connectedDB from "@/config/database";
import Newsletter from "@/models/Newsletter";
import { render } from "@react-email/render";
import UnsubscribeEmail from "@/components/email/UnsubscribeEmail";

const SECRET = process.env.UNSUBSCRIBE_SECRET || "unsubscribe_secret_fallback";

// 📨 1️⃣ POST → Send Unsubscribe Email with Token
export async function POST(req) {
  try {
    await connectedDB();
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
    }

    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) {
      return NextResponse.json({ message: "Subscriber not found" }, { status: 404 });
    }

    // ✅ Generate secure JWT token for unsubscribe link
    const token = jwt.sign({ email: subscriber.email }, SECRET, { expiresIn: "3d" });

    // ✅ Construct unsubscribe link
    const unsubscribeLink = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${token}`;

    // ✅ Render email template
    const emailHtml = render(
      <UnsubscribeEmail
        userName={subscriber.name || subscriber.email.split("@")[0]}
        unsubscribeLink={unsubscribeLink}
      />
    );

    // ✅ Configure transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      secure: false,
      auth: { user: "resend", pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.RESEND_DOMAIN
        ? `support@${process.env.RESEND_DOMAIN}`
        : "onboarding@resend.dev",
      to: subscriber.email,
      subject: "Confirm your Unsubscription from Lemufex 💔",
      html: emailHtml,
    });

    return NextResponse.json({
      message: "Unsubscribe link sent to your email address.",
    });
  } catch (error) {
    console.error("Error sending unsubscribe email:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🚪 2️⃣ GET → When user clicks link (token in URL)
export async function GET(req) {
  try {
    await connectedDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token)
      return NextResponse.json({ message: "Invalid unsubscribe link" }, { status: 400 });

    // ✅ Verify token
    const decoded = jwt.verify(token, SECRET);
    const email = decoded?.email;

    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber)
      return NextResponse.json({ message: "Subscriber not found" }, { status: 404 });

    // ✅ Update status
    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return NextResponse.json({
      message: `You have successfully unsubscribed ${subscriber.email}`,
    });
  } catch (error) {
    console.error("Unsubscribe verification error:", error);
    return NextResponse.json({ message: "Invalid or expired unsubscribe link" }, { status: 400 });
  }
}
