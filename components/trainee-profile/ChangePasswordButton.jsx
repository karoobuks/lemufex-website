// export const dynamic = 'force-dynamic';
// export const revalidate = 0;
// export const fetchCache = 'force-no-store';



// import Link from 'next/link';
// import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
// import { redirect } from 'next/navigation';
// import connectedDB from '@/config/database';
// import User from '@/models/User';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/authOptions';

// const ChangePasswordButton = async () => {
//       await connectedDB();

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

//   const hasPassword = !!user.password;

//     return (   <div className='space-y-4'>
//         { hasPassword ? (<Link
//         href="/account/password"
//         className='bg-[#FE9900] rounded text-white px-4 py-2 hover:bg-orange-600'>
//           Change Password
//         </Link>) : 
//         (<p className='text-gray-500 text-sm'>You signed up with Google. Password change is not available.</p>)}
//       </div> );
// }
 
// export default ChangePasswordButton;


// app/components/ChangePasswordButtonClient.jsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ChangePasswordButtonClient({ hasPassword }) {
  const {data:session, status} = useSession()
  const user = session?.user
  const userId = session?.user?.id
  return (
    <div className="space-y-4">
      { hasPassword && user ? (
        <Link
          href={`/change-password/${userId}`}
          className=" bg-[#FE9900] rounded text-white px-4 py-2 hover:bg-orange-600"
        >
          Change Password
        </Link>
      ) : (
        <p className="text-gray-500 text-sm">
          You signed up with Google. Password change is not available.
        </p>
      )}
    </div>
  );
}
