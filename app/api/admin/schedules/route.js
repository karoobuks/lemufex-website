import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Timetable from "@/models/Schedule";
import { requireAdmin } from "@/utils/requireAdmin";

export const dynamic = "force-dynamic";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// GET — fetch the active timetable
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok)
    return NextResponse.json({ error: guard.reason }, { status: guard.reason === "FORBIDDEN" ? 403 : 401 });

  await connectedDB();
  const timetable = await Timetable.findOne().sort({ version: -1 }).lean();
  return NextResponse.json({ success: true, data: timetable || null });
}

// PUT — create a brand-new timetable (set / reset)
export async function PUT(req) {
  const guard = await requireAdmin();
  if (!guard.ok)
    return NextResponse.json({ error: guard.reason }, { status: guard.reason === "FORBIDDEN" ? 403 : 401 });

  await connectedDB();
  const { title, days } = await req.json();

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const last = await Timetable.findOne().sort({ version: -1 }).select("version").lean();
  const version = last ? last.version + 1 : 1;

  // Ensure all 7 days are present
  const normalised = DAYS.map((d) => {
    const found = (days || []).find((x) => x.day === d);
    return { day: d, slots: found?.slots || [] };
  });

  const timetable = await Timetable.create({
    title,
    days: normalised,
    setBy: guard.session.user.id,
    version,
  });

  return NextResponse.json({ success: true, data: timetable }, { status: 201 });
}

// PATCH — edit the current timetable in-place (title or specific day slots)
export async function PATCH(req) {
  const guard = await requireAdmin();
  if (!guard.ok)
    return NextResponse.json({ error: guard.reason }, { status: guard.reason === "FORBIDDEN" ? 403 : 401 });

  await connectedDB();
  const { title, day, slots } = await req.json();

  const timetable = await Timetable.findOne().sort({ version: -1 });
  if (!timetable) return NextResponse.json({ error: "No timetable found" }, { status: 404 });

  if (title) timetable.title = title;

  if (day && slots !== undefined) {
    const idx = timetable.days.findIndex((d) => d.day === day);
    if (idx === -1) return NextResponse.json({ error: "Invalid day" }, { status: 400 });
    timetable.days[idx].slots = slots;
    timetable.markModified("days");
  }

  await timetable.save();
  return NextResponse.json({ success: true, data: timetable });
}
