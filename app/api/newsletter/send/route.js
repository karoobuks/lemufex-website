import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Newsletter from "@/models/Newsletter";
import { sendEmail } from "@/utils/mailer";

export async function POST(req) {
  try {
    await connectDB();

    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const subscribers = await Newsletter.find({ status: "active" });

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No active subscribers" }, { status: 404 });
    }

    const year = new Date().getFullYear();

    await Promise.all(
      subscribers.map((sub) => {
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <div style="background:#081C3C;padding:32px 24px;text-align:center;">
              <h1 style="color:#FE9900;margin:0;font-size:24px;">Lemufex Engineering</h1>
              <p style="color:#fff;margin:8px 0 0;font-size:14px;">Newsletter</p>
            </div>

            <div style="background:#ffffff;padding:32px 24px;">
              <h2 style="color:#081C3C;font-size:20px;margin:0 0 16px;">${subject}</h2>
              <div style="color:#374151;font-size:15px;line-height:1.7;">
                ${message.replace(/\n/g, "<br/>")}
              </div>

              <div style="text-align:center;margin:32px 0;">
                <a href="${process.env.NEXT_PUBLIC_DOMAIN || "https://lemufex.com"}"
                  style="display:inline-block;padding:14px 32px;background:#FE9900;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">
                  Visit Our Website
                </a>
              </div>

              <p style="color:#374151;font-size:15px;margin-top:24px;">
                Best regards,<br/>
                <strong style="color:#081C3C;">Lemufex Engineering Team</strong>
              </p>
            </div>

            <div style="background:#F3F4F6;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#9CA3AF;font-size:12px;margin:0 0 6px;">
                &copy; ${year} Lemufex Engineering. All rights reserved.
              </p>
              <p style="color:#9CA3AF;font-size:12px;margin:0;">
                You are receiving this because you subscribed to the Lemufex newsletter.
              </p>
            </div>
          </div>
        `;
        return sendEmail(sub.email, subject, html);
      })
    );

    return NextResponse.json({ success: true, sent: subscribers.length });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json({ message: "Error sending newsletter" }, { status: 500 });
  }
}
