// scripts/addSampleReviews.js
import connectDB from '../config/database.js';
import Review from '../models/Review.js';
import { ObjectId } from 'mongodb';

async function addSampleReviews() {
  try {
    await connectDB();
    
    const sampleReviews = [
      {
        userId: new ObjectId(),
        name: 'John Doe',
        email: 'john@example.com',
        rating: 5,
        comment: 'Excellent training program! The instructors were knowledgeable and the hands-on approach really helped me understand the concepts.',
        serviceType: 'training',
        isApproved: true,
        approvedAt: new Date()
      },
      {
        userId: new ObjectId(),
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        rating: 4,
        comment: 'Great service and professional team. They delivered exactly what was promised and on time.',
        serviceType: 'service',
        isApproved: true,
        approvedAt: new Date()
      },
      {
        userId: new ObjectId(),
        name: 'Michael Chen',
        email: 'michael@example.com',
        rating: 5,
        comment: 'The quote process was smooth and transparent. Highly recommend Lemufex for engineering services.',
        serviceType: 'quote',
        isApproved: true,
        approvedAt: new Date()
      }
    ];

    await Review.insertMany(sampleReviews);
    console.log('Sample reviews added successfully!');
    
    const count = await Review.countDocuments({ isApproved: true });
    console.log(`Total approved reviews: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample reviews:', error);
    process.exit(1);
  }
}

addSampleReviews();