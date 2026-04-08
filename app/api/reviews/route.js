import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Review from '@/models/Review';
import User from '@/models/User';
import Trainee from '@/models/Trainee';
import { auth } from '@/auth';

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

    // Try to get name from Trainee first, then fallback to User
    let reviewerName = 'Anonymous';
    
    try {
      const trainee = await Trainee.findOne({ user: session.user.id }).select('fullName');
      if (trainee && trainee.fullName) {
        reviewerName = trainee.fullName;
      } else {
        const user = await User.findById(session.user.id).select('username');
        if (user && user.username) {
          reviewerName = user.username;
        } else if (session.user.email) {
          // Extract name from email as last resort
          reviewerName = session.user.email.split('@')[0];
        }
      }
    } catch (err) {
      console.log('Error getting user name:', err);
      // Keep default 'Anonymous'
    }

    const review = await Review.create({
      userId: session.user.id,
      name: reviewerName,
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