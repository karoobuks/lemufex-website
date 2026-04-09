// // app/api/contact/route.js
// import { NextResponse } from "next/server";
// import { sendEmail } from "@/utils/mailer";

// export async function POST(req) {
//   try {
//     const { name, email, message } = await req.json();

//     const html = `
//       <h2>New Feedback from ${name}</h2>
//       <p><strong>Email:</strong> ${email}</p>
//       <p>${message}</p>
//     `;

//     const sent = await sendEmail(
//       "karoobuks@gmail.com",
//       "New Customer Feedback",
//       html
//     );

//     if (sent) {
//       return NextResponse.json({
//         success: true,
//         msg: "Message sent successfully!",
//       });
//     } else {
//       return NextResponse.json(
//         { success: false, msg: "Failed to send message" },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { success: false, msg: "Server error" },
//       { status: 500 }
//     );
//   }
// }



// app/api/contact/route.js
// import { NextResponse } from "next/server";
// import { sendEmail, sendAcknowledgmentEmail } from "@/utils/mailer";

// export async function POST(req) {
//   try {
//     const { name, email, message } = await req.json();

//     // Email content for admin (your inbox)
//     const html = `
//       <h2>New Feedback from ${name}</h2>
//       <p><strong>Email:</strong> ${email}</p>
//       <p>${message}</p>
//     `;

//     // 1. Send to your inbox
//     const sentToAdmin = await sendEmail(
//       "karoobuks@gmail.com", // replace with your admin email
//       "New Customer Feedback",
//       html
//     );

//     // 2. Send acknowledgment to the user
//     const sentAck = await sendAcknowledgmentEmail(email, name);

//     if (sentToAdmin && sentAck) {
//       return NextResponse.json({
//         success: true,
//         msg: "Message sent successfully, acknowledgment sent to user!",
//       });
//     } else {
//       return NextResponse.json(
//         { success: false, msg: "Failed to send message or acknowledgment" },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { success: false, msg: "Server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { sendEmail, sendAcknowledgmentEmail } from "@/utils/mailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, msg: "All fields are required." },
        { status: 400 }
      );
    }

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#081C3C;padding:24px;">
          <h1 style="color:#FE9900;margin:0;font-size:20px;">Lemufex Engineering</h1>
          <p style="color:#fff;margin:6px 0 0;font-size:13px;">New Contact Form Message</p>
        </div>
        <div style="padding:24px;">
          <p style="margin:0 0 12px;"><strong>Name:</strong> ${name}</p>
          <p style="margin:0 0 12px;"><strong>Email:</strong> ${email}</p>
          <div style="background:#F9FAFB;border-left:4px solid #FE9900;padding:16px;border-radius:4px;">
            <p style="margin:0 0 6px;font-weight:600;">Message:</p>
            <p style="margin:0;color:#374151;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
        </div>
      </div>
    `;

    // Send to lemufex business email
    const sentToAdmin = await sendEmail(
      "lemufexgroup@mail.com",
      `\uD83D\uDCE9 New Contact Message from ${name}`,
      adminHtml
    );

    // Send branded acknowledgement to customer
    const sentAck = await sendAcknowledgmentEmail(email, name);

    if (sentToAdmin) {
      return NextResponse.json({
        success: true,
        msg: "Message sent successfully! We'll get back to you soon.",
      });
    } else {
      return NextResponse.json(
        { success: false, msg: "Failed to send your message. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, msg: "Server error while sending email." },
      { status: 500 }
    );
  }
}
