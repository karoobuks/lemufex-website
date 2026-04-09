// utils/mailer.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const BRAND_HEADER = `
  <div style="background:#081C3C;padding:32px 24px;text-align:center;">
    <h1 style="color:#FE9900;margin:0;font-size:24px;">Lemufex Engineering</h1>
    <p style="color:#fff;margin:8px 0 0;font-size:14px;">SUBTITLE</p>
  </div>
`;

const BRAND_FOOTER = `
  <div style="background:#F3F4F6;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="color:#9CA3AF;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} Lemufex Engineering. All rights reserved.</p>
  </div>
`;

function brandedEmail(subtitle, bodyHtml) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      ${BRAND_HEADER.replace("SUBTITLE", subtitle)}
      <div style="background:#ffffff;padding:32px 24px;">
        ${bodyHtml}
      </div>
      ${BRAND_FOOTER}
    </div>
  `;
}

/*
|--------------------------------------------------------------------------
| Generic Email Sender
|--------------------------------------------------------------------------
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
    const html = brandedEmail("Password Reset Request", `
      <p style="color:#374151;font-size:16px;">Hello,</p>
      <p style="color:#374151;">You requested to reset your password. Click the button below to proceed:</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}"
          style="display:inline-block;padding:14px 32px;background:#FE9900;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">
          Reset Password
        </a>
      </div>
      <p style="color:#374151;">Or copy and paste this link into your browser:</p>
      <p style="word-break:break-all;color:#6B7280;font-size:13px;">${resetUrl}</p>
      <div style="background:#FFF7ED;border-left:4px solid #FE9900;padding:12px 16px;border-radius:4px;margin-top:24px;">
        <p style="margin:0;color:#92400E;font-size:13px;">
          This link will expire in <strong>15 minutes</strong>.
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
      <p style="color:#374151;margin-top:24px;">
        Best regards,<br/><strong style="color:#081C3C;">Lemufex Engineering Team</strong>
      </p>
    `);

    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject: "Reset Your Lemufex Password",
      html,
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
| Acknowledgement Email
|--------------------------------------------------------------------------
*/
export async function sendAcknowledgmentEmail(to, name) {
  try {
    const html = brandedEmail("Message Received", `
      <p style="color:#374151;font-size:16px;">Dear <strong>${name}</strong>,</p>
      <p style="color:#374151;">
        Thank you for reaching out to <strong>Lemufex Engineering</strong>.
        We have received your message and our team will get back to you as soon as possible.
      </p>
      <div style="background:#FFF7ED;border-left:4px solid #FE9900;padding:16px;border-radius:4px;margin:24px 0;">
        <p style="margin:0;color:#92400E;font-size:14px;">
          We typically respond within <strong>24&ndash;48 hours</strong>.
          If your inquiry is urgent, please reply directly to this email.
        </p>
      </div>
      <p style="color:#374151;margin-top:24px;">
        Best regards,<br/><strong style="color:#081C3C;">Lemufex Engineering Team</strong>
      </p>
    `);

    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject: "We\u2019ve received your message \u2013 Lemufex Engineering",
      html,
    });
    console.log("Acknowledgement email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Acknowledgement email error:", error);
    return false;
  }
}

/*
|--------------------------------------------------------------------------
| Welcome Email (Newsletter Subscription)
|--------------------------------------------------------------------------
*/
export async function sendWelcomeEmail(to, name, unsubscribeUrl) {
  try {
    const unsubscribeSection = unsubscribeUrl
      ? `<p style="color:#9CA3AF;font-size:12px;text-align:center;margin-top:8px;">
           Don&apos;t want these emails?
           <a href="${unsubscribeUrl}" style="color:#FE9900;">Unsubscribe</a>
         </p>`
      : "";

    const html = brandedEmail("Newsletter Subscription Confirmed", `
      <h2 style="color:#081C3C;font-size:22px;margin:0 0 16px;">Welcome, ${name || "Friend"}! 🎉</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;">
        Thank you for subscribing to the <strong>Lemufex Engineering</strong> newsletter.
        You are now part of a growing community of engineering professionals and enthusiasts.
      </p>
      <div style="background:#FFF7ED;border-left:4px solid #FE9900;padding:16px 20px;border-radius:4px;margin:24px 0;">
        <p style="margin:0 0 10px;color:#92400E;font-size:13px;font-weight:bold;text-transform:uppercase;">What to expect from us:</p>
        <p style="margin:6px 0;color:#374151;font-size:14px;">&#10003; Engineering insights &amp; industry news</p>
        <p style="margin:6px 0;color:#374151;font-size:14px;">&#10003; Upcoming training programs &amp; workshops</p>
        <p style="margin:6px 0;color:#374151;font-size:14px;">&#10003; Exclusive service offers &amp; announcements</p>
        <p style="margin:6px 0;color:#374151;font-size:14px;">&#10003; Project showcases &amp; case studies</p>
      </div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${process.env.NEXT_PUBLIC_DOMAIN || "https://lemufex.com"}"
          style="display:inline-block;padding:14px 32px;background:#FE9900;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">
          Visit Our Website
        </a>
      </div>
      <p style="color:#374151;font-size:15px;margin-top:24px;">
        Best regards,<br/><strong style="color:#081C3C;">Lemufex Engineering Team</strong>
      </p>
      ${unsubscribeSection}
    `);

    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject: "Welcome to Lemufex Engineering Newsletter \uD83C\uDF89",
      html,
    });
    console.log("Welcome email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Welcome email error:", error);
    return false;
  }
}
