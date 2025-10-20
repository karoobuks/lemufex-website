// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   try {
//     // Get the origin to prevent redirect attacks
//     const origin = req.headers.get('origin') || 'http://localhost:3000';
//     const allowedOrigins = [
//       'http://localhost:3000',
//       'http://localhost:3001',
//       process.env.APP_URL,
//       process.env.NEXTAUTH_URL
//     ].filter(Boolean);
    
//     // Validate origin
//     if (!allowedOrigins.includes(origin)) {
//       return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
//     }
    
//     const response = NextResponse.json({ 
//       message: 'Logged out successfully',
//       redirect: '/login'
//     });
    
//     // Clear all auth cookies
//     response.cookies.set('token', '', {
//       httpOnly: true,
//       expires: new Date(0),
//       path: '/',
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax'
//     });
    
//     response.cookies.set('next-auth.session-token', '', {
//       httpOnly: true,
//       expires: new Date(0),
//       path: '/',
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax'
//     });
    
//     return response;
//   } catch (error) {
//     console.error('Logout error:', error);
//     return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { serialize } from "cookie";
import getRedis from "@/lib/redis";

export async function POST(req) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|;)\s*refresh_token=([^;]+)/);
    const refreshToken = match ? decodeURIComponent(match[1]) : null;

    const redis = getRedis()
    if(refreshToken) {
      await redis.del(`refresh:${refreshToken}`);
    }

    //clear cookies
    const expiredAccess = serialize('access_token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
    const expiredRefresh = serialize('refresh_token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })

    const res = NextResponse.json({ success: 'Logged out'}, { status:200});
    res.headers.set('set-cookie', expiredAccess);
    res.headers.append('set-cookie', expiredRefresh);
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}