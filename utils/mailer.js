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
    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject: "Reset Your Lemufex Password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#081C3C;padding:32px 24px;text-align:center;">
            <h1 style="color:#FE9900;margin:0;font-size:24px;">Lemufex Engineering</h1>
            <p style="color:#fff;margin:8px 0 0;font-size:14px;">Password Reset Request</p>
          </div>
          <div style="padding:32px 24px;">
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
              <p style="margin:0;color:#92400E;font-size:13px;">This link will expire in <strong>15 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
            </div>
            <p style="color:#374151;margin-top:24px;">Best regards,<br/><strong style="color:#081C3C;">Lemufex Engineering Team</strong></p>
          </div>
          <div style="background:#F3F4F6;padding:16px 24px;text-align:center;">
            <p style="color:#9CA3AF;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} Lemufex Engineering. All rights reserved.</p>
          </div>
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
| Acknowledgement Email
|--------------------------------------------------------------------------
| Sent to user after contact form or quote submission
*/
export async function sendAcknowledgmentEmail(to, name) {
  try {
    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject: "We've received your message \u2013 Lemufex Engineering",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#081C3C;padding:32px 24px;text-align:center;">
            <h1 style="color:#FE9900;margin:0;font-size:24px;">Lemufex Engineering</h1>
            <p style="color:#fff;margin:8px 0 0;font-size:14px;">Message Received</p>
          </div>
          <div style="padding:32px 24px;">
            <p style="color:#374151;font-size:16px;">Dear <strong>${name}</strong>,</p>
            <p style="color:#374151;">Thank you for reaching out to <strong>Lemufex Engineering</strong>. We have received your message and our team will get back to you as soon as possible.</p>
            <div style="background:#FFF7ED;border-left:4px solid #FE9900;padding:16px;border-radius:4px;margin:24px 0;">
              <p style="margin:0;color:#92400E;font-size:14px;">We typically respond within <strong>24&ndash;48 hours</strong>. If your inquiry is urgent, please reply directly to this email.</p>
            </div>
            <p style="color:#374151;margin-top:24px;">Best regards,<br/><strong style="color:#081C3C;">Lemufex Engineering Team</strong></p>
          </div>
          <div style="background:#F3F4F6;padding:16px 24px;text-align:center;">
            <p style="color:#9CA3AF;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} Lemufex Engineering. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log("Acknowledgement email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Acknowledgement email error:", error);
    return false;
  }
}
