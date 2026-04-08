import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Review from '@/models/Review';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId, isApproved } = await req.json();

    if (!reviewId || isApproved === undefined) {
      return NextResponse.json({ error: 'Missing reviewId or isApproved' }, { status: 400 });
    }

    await connectDB();

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        isApproved,
        approvedBy: session.user.id,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review updated', review });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json({ error: 'Missing review ID' }, { status: 400 });
    }

    await connectDB();

    const deleted = await Review.findByIdAndDelete(reviewId);

    if (!deleted) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
