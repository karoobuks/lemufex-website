
import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Course from "@/models/Course";


// GET /api/courses/[slug]/prices
export async function GET(req, { params }) {
  try {
    await connectedDB();

    const { slug } = params; //  from URL

    // const decodedName = decodeURIComponent(courseName); // 👈 decode %20 to spaces

    // Find course by slug
    const courseData = await Course.findOne({ slug: new RegExp(`^${slug}$`, "i") });

    if (!courseData) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    console.log('this is the courseData:', courseData)
    return NextResponse.json(
      {
        success: true,
        slug: courseData.slug,
        full: Number(courseData.prices.full) || 0,
        installment: Number(courseData.prices.installment) || 0,
        // totalInstallments: courseData.totalInstallments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching course prices:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
