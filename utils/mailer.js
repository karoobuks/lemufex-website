
// // utils/mailer.js
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
//     const sender = process.env.RESEND_DOMAIN
//       ? `support@${process.env.RESEND_DOMAIN}`
//       : "onboarding@resend.dev";

//     const { error } = await resend.emails.send({
//       from: sender,
//       to: process.env.RESEND_DOMAIN ? to : process.env.RESEND_TEST_EMAIL, 
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


// export async function sendPasswordResetEmail(to, resetUrl) {
//   try {
//     await transporter.sendMail({
//       from: process.env.RESEND_DOMAIN
//         ? `support@${process.env.RESEND_DOMAIN}`
//         : "onboarding@resend.dev",
//       to,
//       subject: "Password Reset Request",
//       html: `
//         <p>Hello,</p>
//         <p>You requested to reset your password.</p>
//         <p>Click the link below to reset it:</p>
//         <a href="${resetUrl}">${resetUrl}</a>
//         <p>This link expires in 15 minutes.</p>
//       `,
//     });

//     console.log("Password reset email sent to:", to);
//     return true;
//   } catch (err) {
//     console.error("Password reset email error:", err);
//     return false;
//   }
// }



// // utils/mailer.js
// import nodemailer from "nodemailer";

// // Gmail SMTP transporter
// export const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: false, // TLS handled automatically
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // Password reset email sender
// export async function sendPasswordResetEmail(to, resetUrl) {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.ADMIN_EMAIL,
//       to,
//       subject: "Reset Your Lemufex Password",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color:#2563eb;">Reset Your Password</h2>
//           <p>You requested to reset your password.</p>
//           <p>Click the button below to reset it:</p>

//           <a href="${resetUrl}"
//             style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;margin:20px 0;">
//             Reset Password
//           </a>

//           <p>Or copy and paste this link into your browser:</p>
//           <p style="word-break: break-all;">${resetUrl}</p>

//           <p style="font-size:14px;color:#666;">
//             This link will expire in 15 minutes.
//           </p>

//           <p style="font-size:14px;color:#666;">
//             If you didn't request this, you can safely ignore this email.
//           </p>
//         </div>
//       `,
//     });

//     console.log("Password reset email sent:", info.messageId);
//     return true;

//   } catch (error) {
//     console.error("Email error:", error);
//     return false;
//   }
// }




// utils/mailer.js
import nodemailer from "nodemailer";

// Gmail SMTP transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


/*
|--------------------------------------------------------------------------
| Generic Email Sender
|--------------------------------------------------------------------------
| Used for internal notifications, admin alerts, etc
*/

export async function sendEmail(to, subject, htmlContent) {
  try {
    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject,
      html: htmlContent,
    });

    console.log("Email sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}


/*
|--------------------------------------------------------------------------
| Password Reset Email
|--------------------------------------------------------------------------
*/

export async function sendPasswordResetEmail(to, resetUrl) {
  try {
    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject: "Reset Your Lemufex Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color:#2563eb;">Reset Your Password</h2>

          <p>You requested to reset your password.</p>

          <p>Click the button below to reset it:</p>

          <a href="${resetUrl}"
            style="display:inline-block;
                   padding:12px 20px;
                   background:#2563eb;
                   color:#fff;
                   text-decoration:none;
                   border-radius:6px;
                   margin:20px 0;">
            Reset Password
          </a>

          <p>Or copy and paste this link into your browser:</p>

          <p style="word-break: break-all;">
            ${resetUrl}
          </p>

          <p style="font-size:14px;color:#666;">
            This link will expire in 15 minutes.
          </p>

          <p style="font-size:14px;color:#666;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Password reset email sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("Password reset email error:", error);
    return false;
  }
}


/*
|--------------------------------------------------------------------------
| Acknowledgment Email
|--------------------------------------------------------------------------
| Used when a user submits a form (contact, quote, etc)
*/

export async function sendAcknowledgmentEmail(to, name) {
  try {
    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject: "We’ve received your message ✔",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color:#2563eb;">Hello ${name},</h2>

          <p>
            Thank you for contacting <strong>Lemufex</strong>.
          </p>

          <p>
            We have received your message and our team will respond shortly.
          </p>

          <p>
            If your inquiry is urgent, please reply to this email.
          </p>

          <br/>

          <p style="color:#666;font-size:14px;">
            — Lemufex Support Team
          </p>
        </div>
      `,
    });

    console.log("Acknowledgment email sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("Acknowledgment email error:", error);
    return false;
  }
}