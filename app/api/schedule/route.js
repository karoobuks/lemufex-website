import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Schedule from "@/models/Schedule";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectedDB();
  const items = await Schedule.find().sort({ versionNumber: -1 }).lean();
  return NextResponse.json({ success: true, data: items });
}
