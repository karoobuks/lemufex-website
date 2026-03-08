import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Review from '@/models/Review';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
