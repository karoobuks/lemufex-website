import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import connectedDB from '@/config/database';
import Payment from '@/models/Payment';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, courseId } = await request.json();

    if (!amount || !courseId) {
      return NextResponse.json({ error: 'Amount and course ID required' }, { status: 400 });
    }

    await connectedDB();

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session.user.email,
        amount: amount * 100, // Convert to kobo
        callback_url: `${process.env.NEXTAUTH_URL}/api/payment/verify`,
        metadata: {
          userId: session.user.id,
          courseId,
          paymentType: 'completion',
          custom_fields: [
            {
              display_name: 'User ID',
              variable_name: 'user_id',
              value: session.user.id
            }
          ]
        }
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      return NextResponse.json({ 
        error: paystackData.message || 'Payment initialization failed' 
      }, { status: 400 });
    }

    // Create payment record
    const payment = new Payment({
      userId: session.user.id,
      course: courseId,
      amount,
      email: session.user.email,
      paymentType: 'installment',
      currentInstallment: 2, // This is the completion payment
      reference: paystackData.data.reference,
      status: 'pending'
    });

    await payment.save();

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference
    });

  } catch (error) {
    console.error('Error initiating payment completion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}