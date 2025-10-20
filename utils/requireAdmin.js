import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return { ok: false, reason: "UNAUTHENTICATED" };
  if (session.user.role !== "admin") return { ok: false, reason: "FORBIDDEN" };
  return { ok: true, session };
}
