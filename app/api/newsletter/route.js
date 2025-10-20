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
import connectedDB from "@/config/database";
import Newsletter from "@/models/Newsletter";

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    await connectedDB();

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        existingSubscriber.status = 'active';
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();
      } else {
        return NextResponse.json(
          { message: "Email already subscribed to newsletter" },
          { status: 400 }
        );
      }
    } else {
      await Newsletter.create({
        email,
        name: name || email.split("@")[0]
      });
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

export async function GET() {
  try {
    await connectedDB();
    
    const subscribers = await Newsletter.find({})
      .sort({ subscribedAt: -1 })
      .select('email name status subscribedAt unsubscribedAt');
    
    const stats = {
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length
    };
    
    return NextResponse.json({ subscribers, stats });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

