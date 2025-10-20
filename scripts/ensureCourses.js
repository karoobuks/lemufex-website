// scripts/ensureCourses.js
import mongoose from 'mongoose';
import Course from '../models/Course.js';

const defaultCourses = [
  {
    name: 'Software Programming',
    prices: { full: 200000, installment: 100000 }
  },
  {
    name: 'Automation',
    prices: { full: 150000, installment: 75000 }
  },
  {
    name: 'Electrical Engineering',
    prices: { full: 180000, installment: 90000 }
  }
];

async function ensureCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const courseData of defaultCourses) {
      const existing = await Course.findOne({ name: courseData.name });
      if (!existing) {
        await Course.create(courseData);
        console.log(`Created course: ${courseData.name}`);
      } else {
        console.log(`Course already exists: ${courseData.name}`);
      }
    }

    console.log('All courses ensured');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

ensureCourses();