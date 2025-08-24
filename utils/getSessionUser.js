

import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import connectedDB from "@/config/database";
import User from "@/models/User";
import Trainee from "@/models/Trainee";

export async function getSessionUser(includeTrainee = false) {
  await connectedDB();

  let user = null;

  // 1️⃣ Try next-auth session
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    user = await User.findOne({ email: session.user.email }).lean();
  }

  // 2️⃣ Try JWT token from cookies
  if (!user) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).lean();
      } catch (error) {
        console.error('❌ Invalid token in getSessionUser:', error);
        return null;
      }
    }
  }

  // 3️⃣ If no user found at all
  if (!user || !user._id) return null;

  // 4️⃣ If requested, also return trainee
  if (includeTrainee) {
    const trainee = await Trainee.findOne({ user: user._id }).lean();
    if (!trainee) return { user, trainee: null }; // or throw 404 in endpoint
    return { user, trainee };
  }

  return user;
}
