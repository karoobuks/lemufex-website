// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import User from "@/models/User"; // your mongoose User model

export async function GET(req) {
  await connectedDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "all";

  const limit = 10;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};
  
  // Search filter (by name or email)
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  
  // Role filter
  if (role !== "all") {
    if (search) {
      query = {
        $and: [
          {
            $or: [
              { firstName: { $regex: search, $options: "i" } },
              { lastName: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ]
          },
          { role: role }
        ]
      };
    } else {
      query.role = role;
    }
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return NextResponse.json({
    users,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
}
