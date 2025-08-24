// // lib/mailer.js
// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host: "smtp.resend.com",
//   port: 587,
//   secure: false, // TLS is optional
//   auth: {
//     user: "resend",
//     pass: process.env.EMAIL_PASS, // store in .env.local
//   },
// });

// export async function sendEmail(to, subject, htmlContent) {
//   try {
//     const info = await transporter.sendMail({
//     //   from: '"Lemufex Group" <no-reply@lemufex.com>', // use your domain email
//       from: "onboarding@resend.dev", // use your domain email
//       to,
//       subject,
//       html: htmlContent,
//     });

//     console.log("Message sent: %s", info.messageId);
//     return true;
//   } catch (err) {
//     console.error("Error sending email:", err);
//     return false;
//   }
// }


// lib/mailer.js
// import nodemailer from "nodemailer";
// import { Resend } from "resend";
// import AcknowledgmentEmail from "@/components/email/AcknowledgementEmail";

// // --- Nodemailer setup (for custom HTML emails) ---
// export const transporter = nodemailer.createTransport({
//   host: "smtp.resend.com",
//   port: 587,
//   secure: false, // TLS optional
//   auth: {
//     user: "resend",
//     pass: process.env.EMAIL_PASS, // your Resend API key as SMTP password
//   },
// });

// // Generic email sender (still works like before)
// export async function sendEmail(to, subject, htmlContent) {
//   try {
//     const info = await transporter.sendMail({
//       from: "onboarding@resend.dev", // ✅ fallback sender
//       to,
//       subject,
//       html: htmlContent,
//     });

//     console.log("Message sent: %s", info.messageId);
//     return true;
//   } catch (err) {
//     console.error("Error sending email:", err);
//     return false;
//   }
// }

// // --- Resend setup (for acknowledgment emails) ---
// const resend = new Resend(process.env.RESEND_API_KEY);

// // Auto acknowledgment email using React template
// export async function sendAcknowledgmentEmail(to, name) {
//   try {
//     const { error } = await resend.emails.send({
//       from: "onboarding@resend.dev", // ✅ must be verified sender
//       to: "karoobuks@gmail.com",
//       subject: "We’ve received your message ✔",
//       react: <AcknowledgmentEmail name={name} />,
//     });

//     if (error) {
//       console.error("Resend error:", error);
//       return false;
//     }

//     console.log("Acknowledgment sent to:", to);
//     return true;
//   } catch (err) {
//     console.error("Send error:", err);
//     return false;
//   }
// }


// lib/mailer.js
// import nodemailer from "nodemailer";
// import { Resend } from "resend";
// import AcknowledgmentEmail from "@/components/email/AcknowledgementEmail";

// // --- Nodemailer setup (for custom HTML emails) ---
// export const transporter = nodemailer.createTransport({
//   host: "smtp.resend.com",
//   port: 587,
//   secure: false, // TLS optional
//   auth: {
//     user: "resend",
//     pass: process.env.EMAIL_PASS, // your Resend API key as SMTP password
//   },
// });

// // Generic email sender (works for admin/internal notifications)
// export async function sendEmail(to, subject, htmlContent) {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.RESEND_DOMAIN
//         ? `support@${process.env.RESEND_DOMAIN}` // ✅ production sender
//         : "onboarding@resend.dev", // ✅ sandbox fallback
//       to,
//       subject,
//       html: htmlContent,
//     });

//     console.log("Message sent: %s", info.messageId);
//     return true;
//   } catch (err) {
//     console.error("Error sending email:", err);
//     return false;
//   }
// }

// // --- Resend setup (for acknowledgment emails) ---
// const resend = new Resend(process.env.RESEND_API_KEY);

// // Auto acknowledgment email using React template
// export async function sendAcknowledgmentEmail(to, name) {
//   try {
//     // figure out sender: sandbox vs production
//     const sender = process.env.RESEND_DOMAIN
//       ? `support@${process.env.RESEND_DOMAIN}` // ✅ use your verified domain
//       : "onboarding@resend.dev"; // ✅ fallback for sandbox mode

//     const { error } = await resend.emails.send({
//       from: sender,
//       to: process.env.RESEND_DOMAIN ? to : process.env.RESEND_TEST_EMAIL, 
//       // ✅ in sandbox: force all emails to your own account
//       subject: "We’ve received your message ✔",
//       react: <AcknowledgmentEmail name={name} />,
//     });

//     if (error) {
//       console.error("Resend error:", error);
//       return false;
//     }

//     console.log(`Acknowledgment sent to: ${to}`);
//     return true;
//   } catch (err) {
//     console.error("Send error:", err);
//     return false;
//   }
// }


// lib/mailer.js
import nodemailer from "nodemailer";
import { Resend } from "resend";
import AcknowledgmentEmail from "@/components/email/AcknowledgementEmail";

// --- Nodemailer setup (for custom HTML emails) ---
export const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  secure: false, // TLS optional
  auth: {
    user: "resend",
    pass: process.env.EMAIL_PASS, // your Resend API key as SMTP password
  },
});

// Generic email sender (works for admin/internal notifications)
export async function sendEmail(to, subject, htmlContent) {
  try {
    const info = await transporter.sendMail({
      from: process.env.RESEND_DOMAIN
        ? `support@${process.env.RESEND_DOMAIN}` // ✅ production sender
        : "onboarding@resend.dev", // ✅ sandbox fallback
      to,
      subject,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
}

// --- Resend setup (for acknowledgment emails) ---
const resend = new Resend(process.env.RESEND_API_KEY);

// Auto acknowledgment email using React template
export async function sendAcknowledgmentEmail(to, name) {
  try {
    const sender = process.env.RESEND_DOMAIN
      ? `support@${process.env.RESEND_DOMAIN}`
      : "onboarding@resend.dev";

    const { error } = await resend.emails.send({
      from: sender,
      to: process.env.RESEND_DOMAIN ? to : process.env.RESEND_TEST_EMAIL, 
      subject: "We’ve received your message ✔",
      react: <AcknowledgmentEmail name={name} />,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }

    console.log(`Acknowledgment sent to: ${to}`);
    return true;
  } catch (err) {
    console.error("Send error:", err);
    return false;
  }
}

// --- New: Password reset email ---
export async function sendPasswordResetEmail(to, resetUrl) {
  try {
    const sender = process.env.RESEND_DOMAIN
      ? `support@${process.env.RESEND_DOMAIN}`
      : "onboarding@resend.dev";

    const { error } = await resend.emails.send({
      from: sender,
      to: process.env.RESEND_DOMAIN ? to : process.env.RESEND_TEST_EMAIL,
      subject: "Password Reset Request",
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }

    console.log(`Password reset email sent to: ${to}`);
    return true;
  } catch (err) {
    console.error("Send error:", err);
    return false;
  }
}
