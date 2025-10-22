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


// import { NextResponse } from "next/server";
// import { sendEmail } from "@/utils/mailer"; 
// import { render } from "@react-email/render";
// import nodemailer from "nodemailer";
// import WelcomeEmail from "@/components/email/WelcomeEmail";
// import connectedDB from "@/config/database";
// import Newsletter from "@/models/Newsletter";

// export async function POST(req) {
//   try {
//     const { email, name } = await req.json();

//     if (!email || !email.includes("@")) {
//       return NextResponse.json(
//         { message: "Invalid email address" },
//         { status: 400 }
//       );
//     }

//     await connectedDB();

//     // Check if email already exists
//     const existingSubscriber = await Newsletter.findOne({ email });
//     if (existingSubscriber) {
//       if (existingSubscriber.status === 'unsubscribed') {
//         existingSubscriber.status = 'active';
//         existingSubscriber.unsubscribedAt = null;
//         await existingSubscriber.save();
//       } else {
//         return NextResponse.json(
//           { message: "Email already subscribed to newsletter" },
//           { status: 400 }
//         );
//       }
//     } else {
//       await Newsletter.create({
//         email,
//         name: name || email.split("@")[0]
//       });
//     }

//     // --- 1. Notify Admin (your inbox) ---
//     await sendEmail(
//       process.env.RESEND_ADMIN_EMAIL || "you@example.com",
//       "📩 New Newsletter Signup",
//       `<p>New subscriber: <strong>${email}</strong></p>`
//     );

//     // --- 2. Send Branded Welcome Email to subscriber ---
//     const emailHtml = await render(<WelcomeEmail userName={name || email.split("@")[0]} />);

//     const transporter = nodemailer.createTransport({
//       host: "smtp.resend.com", // ✅ using Resend SMTP
//       port: 587,
//       secure: false,
//       auth: {
//         user: "resend",
//         pass: process.env.EMAIL_PASS, // your Resend SMTP key
//       },
//     });

//      await transporter.sendMail({
//       from: process.env.RESEND_DOMAIN
//         ? `support@${process.env.RESEND_DOMAIN}`
//         : "onboarding@resend.dev", // sandbox fallback
//       to: email,
//       subject: "Welcome to Lemufex Newsletter 🎉",
//       html: emailHtml,
//     });

//     return NextResponse.json(
//       { message: "Subscription successful! Please check your email." },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Newsletter error:", err);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await connectedDB();
    
//     const subscribers = await Newsletter.find({})
//       .sort({ subscribedAt: -1 })
//       .select('email name status subscribedAt unsubscribedAt');
    
//     const stats = {
//       total: subscribers.length,
//       active: subscribers.filter(s => s.status === 'active').length,
//       unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length
//     };
    
//     return NextResponse.json({ subscribers, stats });
//   } catch (error) {
//     console.error('Error fetching newsletter subscribers:', error);
//     return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
//   }
// }



// import { NextResponse } from "next/server";
// import { sendEmail } from "@/utils/mailer";
// import { render } from "@react-email/render";
// import nodemailer from "nodemailer";
// import WelcomeEmail from "@/components/email/WelcomeEmail";
// import connectedDB from "@/config/database";
// import Newsletter from "@/models/Newsletter";

// // 📩 SUBSCRIBE NEW USER
// export async function POST(req) {
//   try {
//     const { email, name } = await req.json();

//     if (!email || !email.includes("@")) {
//       return NextResponse.json(
//         { message: "Invalid email address" },
//         { status: 400 }
//       );
//     }

//     await connectedDB();

//     // Check if email already exists
//     const existingSubscriber = await Newsletter.findOne({ email });
//     if (existingSubscriber) {
//       if (existingSubscriber.status === "unsubscribed") {
//         existingSubscriber.status = "active";
//         existingSubscriber.unsubscribedAt = null;
//         await existingSubscriber.save();
//       } else {
//         return NextResponse.json(
//           { message: "Email already subscribed to newsletter" },
//           { status: 400 }
//         );
//       }
//     } else {
//       await Newsletter.create({
//         email,
//         name: name || email.split("@")[0],
//       });
//     }

//     // Notify Admin
//     await sendEmail(
//       process.env.RESEND_ADMIN_EMAIL || "you@example.com",
//       "📩 New Newsletter Signup",
//       `<p>New subscriber: <strong>${email}</strong></p>`
//     );

//     // Send welcome email
//     const emailHtml = await render(
//       <WelcomeEmail userName={name || email.split("@")[0]} />
//     );

//     const transporter = nodemailer.createTransport({
//       host: "smtp.resend.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: "resend",
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.RESEND_DOMAIN
//         ? `support@${process.env.RESEND_DOMAIN}`
//         : "onboarding@resend.dev",
//       to: email,
//       subject: "Welcome to Lemufex Newsletter 🎉",
//       html: emailHtml,
//     });

//     return NextResponse.json(
//       { message: "Subscription successful! Please check your email." },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Newsletter error:", err);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }

// // 📊 FETCH SUBSCRIBERS WITH PAGINATION
// export async function GET(req) {
//   try {
//     await connectedDB();

//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 20;
//     const skip = (page - 1) * limit;

//     // Fetch subscribers with pagination
//     const [subscribers, total] = await Promise.all([
//       Newsletter.find({})
//         .sort({ subscribedAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .select("email name status subscribedAt unsubscribedAt"),
//       Newsletter.countDocuments(),
//     ]);

//     const stats = {
//       total,
//       active: await Newsletter.countDocuments({ status: "active" }),
//       unsubscribed: await Newsletter.countDocuments({ status: "unsubscribed" }),
//     };

//     const totalPages = Math.ceil(total / limit);

//     return NextResponse.json({ 
//       subscribers, 
//       stats, 
//       pagination: { totalPages, currentPage: page, limit } 
//     });
//   } catch (error) {
//     console.error("Error fetching newsletter subscribers:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch subscribers" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import connectedDB from "@/config/database";
import Newsletter from "@/models/Newsletter";
import WelcomeEmail from "@/components/email/WelcomeEmail";
import { sendEmail } from "@/utils/mailer";

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
    }

    await connectedDB();

    let subscriber = await Newsletter.findOne({ email });

    // If the user already exists, reactivate if unsubscribed
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

    // --- Generate Unsubscribe Link ---
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;

    // --- 1. Notify Admin ---
    await sendEmail(
      process.env.RESEND_ADMIN_EMAIL || "you@example.com",
      "📩 New Newsletter Signup",
      `<p>New subscriber: <strong>${email}</strong></p>`
    );

    // --- 2. Send Welcome Email with Unsubscribe Link ---
    const emailHtml = await render(
      <WelcomeEmail
        userName={name || email.split("@")[0]}
        unsubscribeUrl={unsubscribeUrl}
      />
    );

    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      secure: false,
      auth: {
        user: "resend",
        pass: process.env.EMAIL_PASS, // Resend SMTP key
      },
    });

    await transporter.sendMail({
      from: process.env.RESEND_DOMAIN
        ? `support@${process.env.RESEND_DOMAIN}`
        : "onboarding@resend.dev",
      to: email,
      subject: "Welcome to Lemufex Newsletter 🎉",
      html: emailHtml,
    });

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
    await connectedDB();

    const { search, page = 1, limit = 10 } = Object.fromEntries(req.nextUrl.searchParams);

    const query = search
      ? {
          $or: [
            { email: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
          ],
        }
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

    return NextResponse.json({
      subscribers,
      stats,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
