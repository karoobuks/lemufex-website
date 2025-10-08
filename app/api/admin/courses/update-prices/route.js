
import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Course from "@/models/Course";
import toSlug from "@/utils/toSlug";

export async function POST(req) {
  try {
    await connectedDB();
    const body = await req.json();

    let updatedCourses = [];

    // ✅ Batch update
    if (body.batch) {
      for (const [name, prices] of Object.entries(body.batch)) {
        const slug = toSlug(name);
        const course = await Course.findOneAndUpdate(
          { slug },
          { $set: { name, slug, prices } },
          { new: true, upsert: true }
        );
         updatedCourses.push(course);
      }
    }

    // ✅ Single update
    else if (body.name && body.prices) {
      const slug = toSlug(body.name);
      const course = await Course.findOneAndUpdate(
        { slug },
        { $set: { name: body.name, slug, prices: body.prices } },
        { new: true, upsert: true }
      );
       updatedCourses.push(course);
    }

    // ✅ Fetch *all* courses after any update
    const allCourses = await Course.find({}).sort({ name: 1 });

    return NextResponse.json({
      message: "Courses updated/added successfully",
      updatedCourses, // only the ones touched
      allCourses,     // full snapshot of DB
    });

  } catch (error) {
    console.error("❌ Error updating courses:", error);
    return NextResponse.json(
      { error: "Error updating courses", details: error.message },
      { status: 500 }
    );
  }
}
