
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectedDB from '@/config/database';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectedDB();

  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).lean();
      return Response.json(user || null);
    }
    const cookieStore = await cookies()
    const token =  cookieStore.get('token')?.value;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).lean();
      return Response.json(user || null);
    }

      // In your middleware.js
    if (token && token.id) {
      const user = await User.findById(token.id).lean();
      if (user?.disabled) {
        return NextResponse.redirect(new URL('/disabled', req.url));
      }
    }

    return Response.json(null, { status: 401 });
  } catch (err) {
    console.error('❌ Error in /api/me:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}


