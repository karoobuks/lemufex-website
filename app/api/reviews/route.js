import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Review from '@/models/Review';
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('name rating comment serviceType createdAt');
    
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rating, comment, serviceType } = await req.json();

    if (!rating || !comment || !serviceType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const review = await Review.create({
      userId: session.user.id,
      name: session.user.firstName + ' ' + (session.user.lastName || ''),
      email: session.user.email,
      rating,
      comment,
      serviceType
    });

    return NextResponse.json({ message: 'Review submitted for approval', review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
