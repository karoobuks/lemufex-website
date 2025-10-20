

// import { getServerSession } from "next-auth";
// import { authOptions } from "./authOptions";
// import jwt from 'jsonwebtoken';
// import { cookies } from "next/headers";
// import connectedDB from "@/config/database";
// import User from "@/models/User";
// import Trainee from "@/models/Trainee";

// export async function getSessionUser(includeTrainee = false) {
//   await connectedDB();

//   let user = null;

//   // 1️⃣ Try next-auth session
//   const session = await getServerSession(authOptions);
//   if (session?.user?.email) {
//     user = await User.findOne({ email: session.user.email }).lean();
//   }

//   // 2️⃣ Try JWT token from cookies
//   if (!user) {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token')?.value;
//     if (token) {
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         user = await User.findById(decoded.id).lean();
//       } catch (error) {
//         console.error('❌ Invalid token in getSessionUser:', error);
//         return null;
//       }
//     }
//   }

//   // 3️⃣ If no user found at all
//   if (!user || !user._id) return null;

//   // 4️⃣ If requested, also return trainee
//   if (includeTrainee) {
//     const trainee = await Trainee.findOne({ user: user._id }).lean();
//     if (!trainee) return { user, trainee: null }; // or throw 404 in endpoint
//     return { user, trainee };
//   }

//   return user;
// }






// import { getServerSession } from 'next-auth';
// import { authOptions } from './authOptions.js';
// import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';
// import connectedDB from '@/config/database.js';
// import User from '@/models/User.js';
// import Trainee from '@/models/Trainee.js';

// export async function getSessionUser(includeTrainee = false) {
//   await connectedDB();

//   let user = null;

//   // 1️⃣ NextAuth session
//   const session = await getServerSession(authOptions);
//   if (session?.user?.email) {
//     user = await User.findOne({ email: session.user.email }).lean();
//   }

//   // 2️⃣ JWT from cookies fallback
//   if (!user) {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token')?.value;
//     if (token) {
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         user = await User.findById(decoded.id).lean();
//       } catch (err) {
//         console.error('Invalid token in getSessionUser:', err);
//         return null;
//       }
//     }
//   }

//   if (!user?._id) return null;

//   // 3️⃣ Include trainee if requested
//   if (includeTrainee) {
//     const trainee = await Trainee.findOne({ user: user._id }).lean();
//     return { user, trainee: trainee || null };
//   }

//   return user;
// }


import { auth } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectedDB from "@/config/database.js";
import User from "@/models/User.js";
import Trainee from "@/models/Trainee.js";

export async function getSessionUser(includeTrainee = false) {
  await connectedDB();

  let user = null;

  // 1️⃣ Try getting user from NextAuth session
  const session = await auth();
  if (session?.user?.email) {
    user = await User.findOne({ email: session.user.email }).lean();
  }

  // 2️⃣ Fallback: try reading JWT from cookies
  if (!user) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).lean();
      } catch (err) {
        console.error("Invalid token in getSessionUser:", err);
        return null;
      }
    }
  }

  if (!user?._id) return null;

  // 3️⃣ If includeTrainee is true, return trainee details too
  if (includeTrainee) {
    const trainee = await Trainee.findOne({ user: user._id }).lean();
    return { user, trainee: trainee || null };
  }

  return user;
}
