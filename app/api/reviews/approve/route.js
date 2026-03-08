import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Review from '@/models/Review';
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId, approve } = await req.json();

    await connectDB();

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        isApproved: approve,
        approvedBy: session.user.id,
        approvedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json({ message: 'Review updated', review });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
