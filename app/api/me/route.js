
// // import { getServerSession } from 'next-auth';
// // import { authOptions } from '@/utils/authOptions';
// // import { cookies } from 'next/headers';
// // import jwt from 'jsonwebtoken';
// // import connectedDB from '@/config/database';
// // import User from '@/models/User';

// // export const dynamic = 'force-dynamic';

// // export async function GET() {
// //   await connectedDB();

// //   try {
// //     const session = await getServerSession(authOptions);
// //     if (session?.user?.email) {
// //       const user = await User.findOne({ email: session.user.email }).lean();
// //       return Response.json(user || null);
// //     }
// //     const cookieStore = await cookies()
// //     const token =  cookieStore.get('token')?.value;
// //     if (token) {
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       const user = await User.findById(decoded.id).lean();
// //       return Response.json(user || null);
// //     }

// //       // In your middleware.js
// //     if (token && token.id) {
// //       const user = await User.findById(token.id).lean();
// //       if (user?.disabled) {
// //         return NextResponse.redirect(new URL('/disabled', req.url));
// //       }
// //     }

// //     return Response.json(null, { status: 401 });
// //   } catch (err) {
// //     console.error('❌ Error in /api/me:', err);
// //     return Response.json({ error: 'Internal server error' }, { status: 500 });
// //   }
// // }


// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/authOptions';
// import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
// import connectedDB from '@/config/database';
// import User from '@/models/User';

// export const dynamic = 'force-dynamic';

// // export async function GET() {
// //   await connectedDB();

// //   try {
// //     let user = null;

// //     // 1️⃣ Check NextAuth session
// //     const session = await getServerSession(authOptions);
// //     if (session?.user?.email) {
// //       user = await User.findOne({ email: session.user.email }).lean();
// //     }

// //     // 2️⃣ Check JWT in cookies if no session user
// //     if (!user) {
// //       const cookieStore = await cookies();
// //       const token = cookieStore.get('token')?.value;

// //       if (token) {
// //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //         user = await User.findById(decoded.id).lean();

// //         // 🔐 Example check for disabled accounts
// //         if (user?.disabled) {
// //           return Response.redirect(new URL('/disabled', req.url));
// //         }
// //       }

// export async function GET() {
//   await connectedDB();

//   try {
//     let user = null;

//     const session = await getServerSession(authOptions);
//     if (session?.user?.email) {
//       user = await User.findOne({ email: session.user.email });
//     }

//     if (!user) {
//       const token = cookies().get("token")?.value;
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         user = await User.findById(decoded.id);
//       }
//     }

//     if (!user) {
//       return Response.json(null, { status: 401 });
//     }

//     return Response.json(user.toJSON()); // ✅ includes hasPassword, hides password
//   } catch (err) {
//     console.error("❌ Error in /api/me:", err);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// //     // 3️⃣ If no user found
// //     if (!user) {
// //       return Response.json(null, { status: 401 });
// //     }

// //     // 4️⃣ Add `hasPassword` field without sending the real password hash
// //     const userWithFlag = {
// //       ...user,
// //       hasPassword: Boolean(user.password && user.password.length > 0),
// //     };

// //     // 🧹 Remove sensitive fields before returning
// //     delete userWithFlag.password;
// //     delete userWithFlag.__v;

// //     return Response.json(userWithFlag);
// //   } catch (err) {
// //     console.error('❌ Error in /api/me:', err);
// //     return Response.json({ error: 'Internal server error' }, { status: 500 });
// //   }
// // }


// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utils/authOptions";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import connectedDB from "@/config/database";
// import User from "@/models/User";

// export const dynamic = "force-dynamic";

// export async function GET() {
//   await connectedDB();

//   try {
//     let user = null;

//     // 1. Try next-auth session
//     const session = await getServerSession(authOptions);
//     if (session?.user?.email) {
//       user = await User.findOne({ email: session.user.email });
//     }

//     // 2. Try JWT cookie
//     if (!user) {
//       const token = cookies().get("token")?.value;
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         user = await User.findById(decoded.id);
//       }
//     }

//     // 3. No user → 401
//     if (!user) {
//       return Response.json(null, { status: 401 });
//     }

//     // ✅ thanks to schema `toJSON`, password is stripped, virtuals are included
//     return Response.json(user.toJSON());

//   } catch (err) {
//     console.error("❌ Error in /api/me:", err);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }



// /api/me/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectedDB from "@/config/database";
import User from "@/models/User";
import Trainee from "@/models/Trainee";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectedDB();

  try {
    let user = null;

    // 1. Try next-auth session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      user = await User.findOne({ email: session.user.email });
    }

    // 2. Try JWT cookie if no session user
    if (!user) {
      const cookieStore = await cookies()
      const token = cookieStore.get("token")?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      }
    }

    // 3. No user → 401
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

     // ✅ Lookup trainee profile if exists
    let trainee = null;
    if (user.isTrainee) {
      trainee = await Trainee.findOne({ user: user._id }).lean();
    }

    // ✅ Explicitly construct safe JSON
    const safeUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      provider: user.provider || "credentials", 
      isTrainee: user.isTrainee,
      // trainee: user.trainee ? {
      //   id: user.trainee._id,
      //   program: user.trainee.program,
      //   startDate: user.trainee.startDate,
      //   progress: user.trainee.progress,
      //   // add only the fields you actually want to expose 👇
      //   // e.g. level, cohort, mentor, etc.
      // } : null,
        trainee: trainee
        ? {
            id: trainee._id,
            fullName: trainee.fullName,
            trainings: trainee.trainings,
            progress: trainee.progress,
          }
        : null,
      createdAt: user.createdAt,
      status: user.status || "Active",
      hasPassword: !!user.password, // 👈 manual users = true, Google users = false
      provider: user.provider || "credentials", // fallback
    };

    return Response.json(safeUser, { status: 200 });

  } catch (err) {
    console.error("❌ Error in /api/me:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
