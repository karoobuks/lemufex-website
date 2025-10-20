import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Course from "@/models/Course";

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

export async function POST() {
  try {
    await connectedDB();
    
    const results = [];
    for (const courseData of defaultCourses) {
      const existing = await Course.findOne({ name: courseData.name });
      if (!existing) {
        const course = await Course.create(courseData);
        results.push(`Created: ${course.name}`);
      } else {
        results.push(`Exists: ${courseData.name}`);
      }
    }
    
    return NextResponse.json({ 
      message: "Courses initialized", 
      results 
    });
  } catch (error) {
    console.error('Error initializing courses:', error);
    return NextResponse.json({ error: 'Failed to initialize courses' }, { status: 500 });
  }
}