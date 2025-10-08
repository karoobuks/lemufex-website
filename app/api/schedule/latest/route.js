import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Schedule from "@/models/Schedule";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectedDB();
  const latest = await Schedule.findOne().sort({ versionNumber: -1 }).lean();
  return NextResponse.json({ success: true, data: latest || null });
}
