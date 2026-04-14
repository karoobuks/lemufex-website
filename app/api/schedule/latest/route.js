import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Timetable from "@/models/Schedule";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectedDB();
  const timetable = await Timetable.findOne().sort({ version: -1 }).lean();
  return NextResponse.json({ success: true, data: timetable || null });
}
