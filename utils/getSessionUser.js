import { auth } from "@/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectedDB from "@/config/database";
import User from "@/models/User";
import Trainee from "@/models/Trainee";

export async function getSessionUser(includeTrainee = false) {
  await connectedDB();

  let user = null;

  // 1️⃣ Get session from Auth.js
  const session = await auth();

  if (session?.user?.email) {
    user = await User.findOne({ email: session.user.email }).lean();
  }

  // 2️⃣ fallback to JWT cookie
  if (!user) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).lean();
      } catch (err) {
        console.error("Invalid token:", err);
        return null;
      }
    }
  }

  if (!user?._id) return null;

  if (includeTrainee) {
    const trainee = await Trainee.findOne({ user: user._id }).lean();
    return { user, trainee: trainee || null };
  }

  return user;
}