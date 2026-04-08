// scripts/fixReviewNames.js
import connectDB from '../config/database.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Trainee from '../models/Trainee.js';

async function fixReviewNames() {
  try {
    await connectDB();
    
    // Find reviews with undefined, null, or empty names
    const reviewsToFix = await Review.find({
      $or: [
        { name: { $exists: false } },
        { name: null },
        { name: '' },
        { name: 'undefined' },
        { name: 'undefined undefined' }
      ]
    });

    console.log(`Found ${reviewsToFix.length} reviews to fix`);

    for (const review of reviewsToFix) {
      let newName = 'Anonymous';
      
      try {
        // Try to get name from Trainee first
        const trainee = await Trainee.findOne({ user: review.userId }).select('fullName');
        if (trainee && trainee.fullName) {
          newName = trainee.fullName;
        } else {
          // Fallback to User
          const user = await User.findById(review.userId).select('username');
          if (user && user.username) {
            newName = user.username;
          } else if (review.email) {
            // Extract from email as last resort
            newName = review.email.split('@')[0];
          }
        }
      } catch (err) {
        console.log(`Error getting name for review ${review._id}:`, err);
      }

      // Update the review
      await Review.findByIdAndUpdate(review._id, { name: newName });
      console.log(`Updated review ${review._id} with name: ${newName}`);
    }

    console.log('Finished fixing review names');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing review names:', error);
    process.exit(1);
  }
}

fixReviewNames();