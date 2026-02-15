import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Payment from '@/models/Payment';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, courseId, proofUrl } = await req.json();

    if (!amount || !proofUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const payment = await Payment.create({
      userId: session.user.id,
      courseId,
      amount,
      paymentMethod: 'bank_transfer',
      paymentProof: proofUrl,
      status: 'pending',
      reference: `BT-${Date.now()}-${session.user.id.slice(-6)}`
    });

    return NextResponse.json({ 
      message: 'Payment proof submitted successfully', 
      payment,
      reference: payment.reference
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
