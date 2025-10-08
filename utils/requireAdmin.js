import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { ok: false, reason: "UNAUTHENTICATED" };
  if (session.user.role !== "admin") return { ok: false, reason: "FORBIDDEN" };
  return { ok: true, session };
}
