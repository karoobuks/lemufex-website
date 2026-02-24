// // app/api/admin/users/route.js
// import { NextResponse } from "next/server";
// import connectedDB from "@/config/database";
// import Trainee from "@/models/Trainee";

// export async function GET(req) {
//   await connectedDB();

//   const { searchParams } = new URL(req.url);
//   const page = parseInt(searchParams.get("page")) || 1;
//   const search = searchParams.get("search") || "";
//   const course = searchParams.get("course") || "all";
//   const isExport = searchParams.get("export") === "true";

//   const limit = isExport ? 0 : 10;
//   const skip = isExport ? 0 : (page - 1) * limit;

//   // Build query
//   let query = {};
  
//   // Search filter (by name or email)
//   if (search) {
//     query.$or = [
//       { fullName: { $regex: search, $options: "i" } },
//       { email: { $regex: search, $options: "i" } },
//     ];
//   }
  
//   // Course filter
//   if (course !== "all") {
//     const courseQuery = {
//       $or: [
//         { "trainings.track": course },
//         { course: course }
//       ]
//     };
    
//     // Combine with search if both exist
//     if (search) {
//       query = {
//         $and: [
//           {
//             $or: [
//               { fullName: { $regex: search, $options: "i" } },
//               { email: { $regex: search, $options: "i" } },
//             ]
//           },
//           courseQuery
//         ]
//       };
//     } else {
//       query = courseQuery;
//     }
//   }

//   if (isExport) {
//     const allTrainees = await Trainee.find(query)
//       .sort({ createdAt: -1 })
//       .lean();
    
//     // Deduplicate by email for export, prioritizing proper fullNames
//     const traineeMap = new Map();
    
//     allTrainees.forEach(trainee => {
//       const existing = traineeMap.get(trainee.email);
      
//       if (!existing) {
//         traineeMap.set(trainee.email, trainee);
//       } else {
//         // Keep the one with a proper fullName (not "Trainee")
//         if (trainee.fullName && trainee.fullName.toLowerCase() !== 'trainee' && 
//             (!existing.fullName || existing.fullName.toLowerCase() === 'trainee')) {
//           traineeMap.set(trainee.email, trainee);
//         }
//       }
//     });
    
//     const trainees = Array.from(traineeMap.values());
      
//     return NextResponse.json({ trainees });
//   }

//   const [allTrainees, total] = await Promise.all([
//     Trainee.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean(),
//     Trainee.countDocuments(query),
//   ]);

//   // Deduplicate by email, prioritizing records with proper fullNames
//   const traineeMap = new Map();
  
//   allTrainees.forEach(trainee => {
//     const existing = traineeMap.get(trainee.email);
    
//     if (!existing) {
//       traineeMap.set(trainee.email, trainee);
//     } else {
//       // Keep the one with a proper fullName (not "Trainee")
//       if (trainee.fullName && trainee.fullName.toLowerCase() !== 'trainee' && 
//           (!existing.fullName || existing.fullName.toLowerCase() === 'trainee')) {
//         traineeMap.set(trainee.email, trainee);
//       }
//     }
//   });
  
//   const trainees = Array.from(traineeMap.values());

//   return NextResponse.json({
//     trainees,
//     pagination: {
//       total: trainees.length,
//       page,
//       pages: Math.ceil(trainees.length / limit),
//     },
//   });
// }



//app/api/admin/trainees/route.js

import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Trainee from "@/models/Trainee";

export async function GET (req) {
  try{
    await connectedDB();

    const { searchParams} = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const search = searchParams.get("search")?.trim() || "";
    const course = searchParams.get("course") || "all";
    const isExport = searchParams.get("export") === "true";

    const limit = isExport ? 0 : 10;
    const skip = isExport ? 0 : (page - 1) * limit;

    // -----------------------------
    // Build Dynamic Query
    // -----------------------------
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i"} },
        { email: { $regex: search, $options: "i"} },
      ];
    }

    if (course !== "all") {
      query.$and = query.$and || [];

      query.$and.push({
        $or: [
          { "trainings.track": course },
          { course: course },
        ],
      });
    }

    // If both search and course exist, Mongo handles $or + $and correctly

    // -----------------------------
    // Fetch Data
    // -----------------------------

    const [trainees, total] = await Promise.all([
      Trainee.find(query)
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)
        .lean(),

        isExport ? 0 : Trainee.countDocuments(query),
    ]);

        // -----------------------------
    // Response
    // -----------------------------

    if(isExport) {
      return NextResponse.json({ trainees });
    }

    return NextResponse.json({
      trainees,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });

  } catch(error) {
    console.error("Error fetching trainees:", error);

    return NextResponse.json(
      { message: "Internal Server Error"},
      { status: 500 }
    );
  }
}