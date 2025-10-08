// /api/admin/courses/[slug]/route.js (or .ts if using TS)
import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Course from "@/models/Course";

export async function DELETE(req, { params }) {
  try {
    await connectedDB();

    const { slug } = params;

    const deleted = await Course.findOneAndDelete({ slug });

    if (!deleted) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Course deleted successfully",
      deletedCourse: deleted,
    });
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    return NextResponse.json(
      { error: "Error deleting course", details: error.message },
      { status: 500 }
    );
  }
}
