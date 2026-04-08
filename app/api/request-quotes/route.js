import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import RequestQuote from '@/models/RequestQuote';
import cloudinary from '@/config/cloudinary';
import { sendEmail } from '@/utils/mailer';

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.formData();
    const name    = data.get('name');
    const email   = data.get('email');
    const phone   = data.get('phone');
    const service = data.get('service');
    const options = data.get('options');
    const message = data.get('message');
    const file    = data.get('file');

    if (!name || !email || !message || !service) {
      return NextResponse.json({ success: false, error: 'Name, email, service and message are required' }, { status: 400 });
    }

    let imageUrl = '';
    if (file && typeof file === 'object' && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'File size exceeds 5MB' }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'Lemufex-website' },
          (err, result) => err ? reject(err) : resolve(result)
        ).end(buffer);
      });
      imageUrl = upload.secure_url;
    }

    const newQuote = await RequestQuote.create({
      name, email, phone, service, options, message, image: imageUrl,
    });

    // Send acknowledgement email to user
    await sendEmail(
      email,
      'We received your quote request – Lemufex Engineering',
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#081C3C;padding:32px 24px;text-align:center;">
          <h1 style="color:#FE9900;margin:0;font-size:24px;">Lemufex Engineering</h1>
          <p style="color:#fff;margin:8px 0 0;font-size:14px;">Quote Request Received</p>
        </div>
        <div style="padding:32px 24px;">
          <p style="color:#374151;font-size:16px;">Dear <strong>${name}</strong>,</p>
          <p style="color:#374151;">Thank you for reaching out to us. We have received your quote request and our team will review it shortly.</p>
          <div style="background:#F9FAFB;border-left:4px solid #FE9900;padding:16px;border-radius:4px;margin:24px 0;">
            <p style="margin:0 0 8px;color:#6B7280;font-size:13px;font-weight:600;text-transform:uppercase;">Your Request Summary</p>
            <p style="margin:4px 0;color:#111827;"><strong>Service:</strong> ${service}</p>
            ${options ? `<p style="margin:4px 0;color:#111827;"><strong>Specific Need:</strong> ${options}</p>` : ''}
            <p style="margin:4px 0;color:#111827;"><strong>Message:</strong> ${message}</p>
          </div>
          <p style="color:#374151;">We typically respond within <strong>24–48 hours</strong>. If your request is urgent, please call us directly.</p>
          <p style="color:#374151;margin-top:24px;">Best regards,<br/><strong style="color:#081C3C;">Lemufex Engineering Team</strong></p>
        </div>
        <div style="background:#F3F4F6;padding:16px 24px;text-align:center;">
          <p style="color:#9CA3AF;font-size:12px;margin:0;">© ${new Date().getFullYear()} Lemufex Engineering. All rights reserved.</p>
        </div>
      </div>`
    );

    return NextResponse.json({ success: true, data: newQuote }, { status: 201 });
  } catch (error) {
    console.error('Request quote error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const quotes = await RequestQuote.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, quotes });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
