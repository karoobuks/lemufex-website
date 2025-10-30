// import connectedDB from "@/config/database";
// import Trainee from "@/models/Trainee";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   await connectedDB();
//   const { userId } = params;

//   try {
//     const trainee = await Trainee.findOne({ user: userId }).populate(
//       "trainings.course",
//       "name totalModules"
//     );

//     if (!trainee) {
//       return NextResponse.json({ error: "Trainee not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         data: {
//           ...trainee.toObject(),
//           enrollmentDate: trainee.createdAt, // main trainee registration date
//           trainings: trainee.trainings.map((t) => ({
//             track: t.track,
//             courseName: t.course?.name || "N/A",
//             totalModules: t.course?.totalModules || 0,
//             completedModules: t.completedModules || 0,
//             enrolledAt: t.enrolledAt || trainee.createdAt, // fallback
//           })),
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching trainee:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


import connectedDB from "@/config/database";
import Trainee from "@/models/Trainee";
import { NextResponse } from "next/server";
import Course from "@/models/Course";

export async function GET(req, { params }) {
  await connectedDB();
  const { userId } = await params;

  try {
    const trainee = await Trainee.findOne({ user: userId })
      .populate("trainings.course", "name totalModules");

    if (!trainee) {
      return NextResponse.json({ error: "Trainee not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...trainee.toObject(),
        enrollmentDate: trainee.createdAt,
        trainings: trainee.trainings.map((t) => ({
          track: t.track,
          courseName: t.course?.name || "Unknown",
          totalModules: t.course?.totalModules || 0,
          completedModules: t.completedModules || 0,
          enrolledAt: t.enrolledAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching trainee:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
