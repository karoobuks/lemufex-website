import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import RequestQuote from '@/models/RequestQuote';
import { auth } from '@/auth';
import { sendEmail } from '@/utils/mailer';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quoteId, replyMessage } = await req.json();

    if (!quoteId || !replyMessage?.trim()) {
      return NextResponse.json({ error: 'Quote ID and reply message are required' }, { status: 400 });
    }

    await connectDB();

    const quote = await RequestQuote.findById(quoteId);
    if (!quote) {
      return NextResponse.json({ error: 'Quote request not found' }, { status: 404 });
    }

    // Send personal reply email to the user
    await sendEmail(
      quote.email,
      `Re: Your Quote Request for ${quote.service} – Lemufex Engineering`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#081C3C;padding:32px 24px;text-align:center;">
          <h1 style="color:#FE9900;margin:0;font-size:24px;">Lemufex Engineering</h1>
          <p style="color:#fff;margin:8px 0 0;font-size:14px;">Response to Your Quote Request</p>
        </div>
        <div style="padding:32px 24px;">
          <p style="color:#374151;font-size:16px;">Dear <strong>${quote.name}</strong>,</p>
          <p style="color:#374151;">Thank you for your patience. Our team has reviewed your quote request and here is our response:</p>

          <div style="background:#FFF7ED;border-left:4px solid #FE9900;padding:20px;border-radius:4px;margin:24px 0;">
            <p style="margin:0 0 8px;color:#92400E;font-size:13px;font-weight:600;text-transform:uppercase;">Our Response</p>
            <p style="margin:0;color:#111827;font-size:15px;line-height:1.6;">${replyMessage.replace(/\n/g, '<br/>')}</p>
          </div>

          <div style="background:#F9FAFB;padding:16px;border-radius:8px;margin:24px 0;">
            <p style="margin:0 0 8px;color:#6B7280;font-size:13px;font-weight:600;text-transform:uppercase;">Your Original Request</p>
            <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Service:</strong> ${quote.service}</p>
            ${quote.options ? `<p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Specific Need:</strong> ${quote.options}</p>` : ''}
            <p style="margin:4px 0;color:#374151;font-size:14px;"><strong>Your Message:</strong> ${quote.message}</p>
          </div>

          <p style="color:#374151;">If you have further questions, simply reply to this email or contact us directly.</p>
          <p style="color:#374151;margin-top:24px;">Best regards,<br/><strong style="color:#081C3C;">Lemufex Engineering Team</strong></p>
        </div>
        <div style="background:#F3F4F6;padding:16px 24px;text-align:center;">
          <p style="color:#9CA3AF;font-size:12px;margin:0;">© ${new Date().getFullYear()} Lemufex Engineering. All rights reserved.</p>
        </div>
      </div>`
    );

    // Update quote status and save reply
    await RequestQuote.findByIdAndUpdate(quoteId, {
      status: 'replied',
      adminReply: replyMessage,
      repliedAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Quote reply error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
