// import { NextResponse } from "next/server";
// import { sendEmail, sendAcknowledgmentEmail } from "@/utils/mailer"; 

// export async function POST(req) {
//   try {
//     const { email } = await req.json();

//     if (!email || !email.includes("@")) {
//       return NextResponse.json(
//         { message: "Invalid email address" },
//         { status: 400 }
//       );
//     }

//     // Send admin notification (to your inbox)
//     await sendEmail(
//       process.env.RESEND_ADMIN_EMAIL || "you@example.com",
//       "📩 New Newsletter Signup",
//       `<p>New subscriber: <strong>${email}</strong></p>`
//     );

//     // Send acknowledgment email to subscriber
//     await sendAcknowledgmentEmail(email, email.split("@")[0]);

//     return NextResponse.json(
//       { message: "Subscription successful! Please check your email." },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer"; 
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import WelcomeEmail from "@/components/email/WelcomeEmail";

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    // --- 1. Notify Admin (your inbox) ---
    await sendEmail(
      process.env.RESEND_ADMIN_EMAIL || "you@example.com",
      "📩 New Newsletter Signup",
      `<p>New subscriber: <strong>${email}</strong></p>`
    );

    // --- 2. Send Branded Welcome Email to subscriber ---
    const emailHtml = await render(<WelcomeEmail userName={name || email.split("@")[0]} />);

    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com", // ✅ using Resend SMTP
      port: 587,
      secure: false,
      auth: {
        user: "resend",
        pass: process.env.EMAIL_PASS, // your Resend SMTP key
      },
    });

     await transporter.sendMail({
      from: process.env.RESEND_DOMAIN
        ? `support@${process.env.RESEND_DOMAIN}`
        : "onboarding@resend.dev", // sandbox fallback
      to: email,
      subject: "Welcome to Lemufex Newsletter 🎉",
      html: emailHtml,
    });

    return NextResponse.json(
      { message: "Subscription successful! Please check your email." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

