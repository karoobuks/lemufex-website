import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Timetable from "@/models/Schedule";
import { requireAdmin } from "@/utils/requireAdmin";

export const dynamic = "force-dynamic";

// DELETE — remove a specific timetable version by id
export async function DELETE(_req, { params }) {
  const guard = await requireAdmin();
  if (!guard.ok)
    return NextResponse.json({ error: guard.reason }, { status: guard.reason === "FORBIDDEN" ? 403 : 401 });

  await connectedDB();
  await Timetable.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
