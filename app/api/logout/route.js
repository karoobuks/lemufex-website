import { NextResponse } from 'next/server';

// ✅ Clear cookie manually
export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0), // ✅ Expire it
    path: '/',            // ✅ Match cookie path
  });

  return response;
}
