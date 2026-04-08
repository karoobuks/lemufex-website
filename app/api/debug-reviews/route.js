import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Review from '@/models/Review';

export async function GET() {
  try {
    await connectDB();
    
    // Get all reviews (approved and pending) for debugging
    const allReviews = await Review.find({});
    const approvedReviews = await Review.find({ isApproved: true });
    
    return NextResponse.json({ 
      total: allReviews.length,
      approved: approvedReviews.length,
      allReviews: allReviews.map(r => ({
        _id: r._id,
        name: r.name,
        comment: r.comment,
        rating: r.rating,
        serviceType: r.serviceType,
        isApproved: r.isApproved,
        createdAt: r.createdAt
      })),
      approvedReviews: approvedReviews.map(r => ({
        _id: r._id,
        name: r.name,
        comment: r.comment,
        rating: r.rating,
        serviceType: r.serviceType,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}