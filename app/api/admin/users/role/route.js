import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import User from "@/models/User";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  await connectedDB();

  // Only the super admin can change roles
  const caller = await User.findById(session.user.id).select("isSuperAdmin role").lean();
  if (!caller?.isSuperAdmin)
    return NextResponse.json({ error: "Only the super admin can change user roles" }, { status: 403 });

  const { userId, role } = await req.json();
  if (!userId || !["user", "admin", "trainee"].includes(role))
    return NextResponse.json({ error: "Invalid userId or role" }, { status: 400 });

  // Prevent demoting yourself
  if (userId === session.user.id)
    return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 });

  // Prevent touching another super admin
  const target = await User.findById(userId).select("isSuperAdmin").lean();
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.isSuperAdmin)
    return NextResponse.json({ error: "Cannot change the role of another super admin" }, { status: 403 });

  const updated = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, select: "_id email role firstName lastName" }
  ).lean();

  return NextResponse.json({ success: true, data: updated });
}
