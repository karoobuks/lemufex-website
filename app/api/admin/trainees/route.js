// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Trainee from "@/models/Trainee";

export async function GET(req) {
  await connectedDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const course = searchParams.get("course") || "all";
  const isExport = searchParams.get("export") === "true";

  const limit = isExport ? 0 : 10;
  const skip = isExport ? 0 : (page - 1) * limit;

  // Build query
  let query = {};
  
  // Search filter (by name or email)
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  
  // Course filter
  if (course !== "all") {
    const courseQuery = {
      $or: [
        { "trainings.track": course },
        { course: course }
      ]
    };
    
    // Combine with search if both exist
    if (search) {
      query = {
        $and: [
          {
            $or: [
              { fullName: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ]
          },
          courseQuery
        ]
      };
    } else {
      query = courseQuery;
    }
  }

  if (isExport) {
    const trainees = await Trainee.find(query)
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json({ trainees });
  }

  const [trainees, total] = await Promise.all([
    Trainee.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Trainee.countDocuments(query),
  ]);

  return NextResponse.json({
    trainees,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
}
