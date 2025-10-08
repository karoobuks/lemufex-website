import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Schedule from "@/models/Schedule";
import { requireAdmin } from "@/utils/requireAdmin";

export const dynamic = "force-dynamic";

export async function DELETE(_req, { params }) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.reason }, { status: guard.reason === "FORBIDDEN" ? 403 : 401 });
  }

  await connectedDB();
  const { id } = params;
  await Schedule.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
