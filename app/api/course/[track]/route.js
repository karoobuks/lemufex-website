// // /api/course/[track]/route.js
// import connectedDB from "@/config/database";
// import Course from "@/models/Course";

// export const dynamic = "force-dynamic";

// export async function GET(req, { params }) {
//   await connectedDB();
//   const { track } = params;

//   try {
//     const course = await Course.findOne({ name: track }).lean();

//     if (!course) {
//       return Response.json({ error: "Course not found" }, { status: 404 });
//     }

//     return Response.json(course, { status: 200 });
//   } catch (err) {
//     console.error("❌ Error in /api/course/[track]:", err);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


// /api/course/[track]/route.js
import connectedDB from "@/config/database";
import Course from "@/models/Course";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  await connectedDB();
  const { track } = params;

  try {
    const course = await Course.findOne({ slug: track }).lean();

    if (!course) {
      return Response.json({ error: "Course not found" }, { status: 404 });
    }

    return Response.json(course, { status: 200 });
  } catch (err) {
    console.error("❌ Error in /api/course/[track]:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
