import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import connectedDB from '@/config/database';
import Payment from '@/models/Payment';
import Trainee from '@/models/Trainee';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectedDB();

    // Get all payments for this user (including pending)
    const payments = await Payment.find({ 
      userId: session.user.id
    }).populate('course').sort({ paidAt: -1 });

    if (payments.length === 0) {
      return NextResponse.json(null);
    }

    // Get successful payments only for calculation
    const successfulPayments = payments.filter(p => ['success', 'completed'].includes(p.status));
    const totalPaid = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const latestPayment = payments[0];
    
    // Get course details
    const courseId = latestPayment.course?._id || latestPayment.course;
    
    // Default course prices
    const coursePrices = {
      'Automation': { full: 150000, installment: 80000 },
      'Electrical Engineering': { full: 120000, installment: 65000 },
      'Software Programming': { full: 100000, installment: 55000 }
    };

    // Determine track from course or payment
    let track = 'Software Programming';
    if (latestPayment.course?.name) {
      track = latestPayment.course.name;
    }
    
    const paymentType = latestPayment.paymentType || 'installment';
    
    // For installment payments, total amount is the full course price
    let totalAmount;
    if (paymentType === 'installment') {
      totalAmount = coursePrices[track]?.full || coursePrices['Software Programming'].full;
    } else {
      totalAmount = coursePrices[track]?.full || coursePrices['Software Programming'].full;
    }
    
    const pendingAmount = Math.max(0, totalAmount - totalPaid);
    const isCompleted = pendingAmount === 0;

    return NextResponse.json({
      totalAmount,
      paidAmount: totalPaid,
      pendingAmount,
      paymentType,
      isCompleted,
      courseId,
      track,
      payments: payments.map(p => ({
        amount: p.amount,
        paidAt: p.paidAt,
        reference: p.reference,
        status: p.status
      }))
    });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}