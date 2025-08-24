// // app/components/ChangePasswordButtonWrapper.jsx
// // export const dynamic = 'force-dynamic';
// // export const revalidate = 0;
// // export const fetchCache = 'force-no-store';

// // import connectedDB from '@/config/database';
// // import User from '@/models/User';
// // import { cookies } from 'next/headers';
// // import jwt from 'jsonwebtoken';
// // import { redirect } from 'next/navigation';
// // import { getServerSession } from 'next-auth';
// // import { authOptions } from '@/utils/authOptions';
// // import ChangePasswordButtonClient from './ChangePasswordButton';

// // export default async function ChangePasswordButtonWrapper() {
// //   await connectedDB();

// //   let user = null;
// //   const session = await getServerSession(authOptions);

// //   if (session?.user?.email) {
// //     user = await User.findOne({ email: session.user.email }).lean();
// //   }

// //   if (!user) {
// //     const token = cookies().get('token')?.value;
// //     if (!token) return redirect('/login');

// //     try {
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       user = await User.findById(decoded.id).lean();
// //     } catch (err) {
// //       console.error('❌ Invalid or expired manual JWT token:', err);
// //       return redirect('/login');
// //     }
// //   }

// //   if (!user) {
// //     console.error('❌ No user found after auth.');
// //     return (
// //       <section className="text-center py-10 text-red-500 text-lg">
// //         Failed to load profile. Please try again later.
// //       </section>
// //     );
// //   }

// //   //const hasPassword = !!user?.password;
// //   const hasPassword = !!session?.user?.password;

// //   // Pass only needed data to client
// //   return <ChangePasswordButtonClient hasPassword={hasPassword} />;
// // }


// export const dynamic = 'force-dynamic';
// export const revalidate = 0;
// export const fetchCache = 'force-no-store';

// import connectedDB from '@/config/database';
// import User from '@/models/User';
// import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
// import { redirect } from 'next/navigation';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/authOptions';
// import ChangePasswordButtonClient from './ChangePasswordButton';

// export default async function ChangePasswordButtonWrapper() {
//   await connectedDB();

//   let user = null;
//   const session = await getServerSession(authOptions);

//   if (session?.user?.email) {
//     user = await User.findOne({ email: session.user.email }).lean();
//   }

//   if (!user) {
//     const token = cookies().get('token')?.value;
//     if (!token) return redirect('/login');

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       user = await User.findById(decoded.id).lean();
//     } catch (err) {
//       console.error('❌ Invalid or expired manual JWT token:', err);
//       return redirect('/login');
//     }
//   }

//   if (!user) {
//     console.error('❌ No user found after auth.');
//     return (
//       <section className="text-center py-10 text-red-500 text-lg">
//         Failed to load profile. Please try again later.
//       </section>
//     );
//   }

//   // ✅ Correct: check from DB user, not session
//  const hasPassword = user?.hasPassword ?? false;

//   // Pass only safe values to client
//   return <ChangePasswordButtonClient hasPassword={hasPassword} />;
// }



// app/account/ChangePasswordButtonWrapper.js
import ChangePasswordButtonClient from "./ChangePasswordButton";

export default async function ChangePasswordButtonWrapper() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // ✅ avoid stale user data
    });

    if (!res.ok) {
      console.error("❌ Failed to fetch user from /api/me");
      return (
        <section className="text-center py-10 text-red-500 text-lg">
          Failed to load profile. Please try again later.
        </section>
      );
    }

    const data = await res.json();
    const hasPassword = data?.hasPassword ?? false;

    return <ChangePasswordButtonClient hasPassword={hasPassword} />;
  } catch (err) {
    console.error("❌ Error in ChangePasswordButtonWrapper:", err);
    return (
      <section className="text-center py-10 text-red-500 text-lg">
        Failed to load profile. Please try again later.
      </section>
    );
  }
}
