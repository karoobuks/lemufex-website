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

    // ✅ Email content for admin (your inbox)
    const adminHtml = `
      <h2>New Feedback Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // 1️⃣ Send feedback to admin
    const sentToAdmin = await sendEmail(
      "karoobuks@gmail.com", // replace with your inbox
      "📩 New Customer Feedback",
      adminHtml
    );

    // 2️⃣ Send acknowledgment to customer
    const sentAck = await sendAcknowledgmentEmail(email, name);

    // ✅ Response handling
    if (sentToAdmin && sentAck) {
      return NextResponse.json({
        success: true,
        msg: "Message sent successfully. An acknowledgment email has been sent to you!",
      });
    } else if (sentToAdmin && !sentAck) {
      return NextResponse.json({
        success: true,
        msg: "Message sent successfully, but acknowledgment email failed.",
      });
    } else {
      return NextResponse.json(
        { success: false, msg: "Failed to send your message. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error sending emails:", error);
    return NextResponse.json(
      { success: false, msg: "Server error while sending email." },
      { status: 500 }
    );
  }
}
