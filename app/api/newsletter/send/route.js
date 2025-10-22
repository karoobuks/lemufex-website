import { NextResponse } from "next/server";
import Newsletter from "@/models/Newsletter";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { subject, message } = await req.json();
    if (!subject || !message)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    // Fetch active subscribers
    const subscribers = await Newsletter.find({ status: "active" });
    if (subscribers.length === 0)
      return NextResponse.json({ message: "No active subscribers" }, { status: 404 });

    // Send emails
    await Promise.all(
      subscribers.map(async (sub) => {
        await resend.emails.send({
          from: "Your Name <newsletter@yourdomain.com>", // Use your verified domain email
          to: sub.email,
          subject,
          html: `<div style="font-family:sans-serif;">
                  <h2>${subject}</h2>
                  <p>${message}</p>
                  <hr/>
                  <p style="font-size:12px;color:#555;">
                    You’re receiving this email because you subscribed to our newsletter.
                  </p>
                </div>`,
        });
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json({ message: "Error sending newsletter" }, { status: 500 });
  }
}
