// import { NextResponse } from "next/server";
// import connectedDB from "@/config/database";

// export async function GET() {
//   try {
//     // Try connecting to the DB (optional)
//     await connectedDB();

//     return NextResponse.json({ status: "ok", message: "App is awake!" });
//   } catch (error) {
//     console.error("Ping failed:", error.message);
//     return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
//   }
// }


// /app/api/ping/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Just return a simple response, no DB connection needed
    return NextResponse.json({ status: "ok", message: "App is awake!" });
  } catch (error) {
    console.error("Ping failed:", error.message);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
