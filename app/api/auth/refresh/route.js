import { NextResponse } from "next/server";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { consumeRefreshToken, createRefreshToken } from "@/lib/authHelpers";
import connectedDB from "@/config/database";
import User from "@/models/User";


const REFRESH_TTL = parseInt(process.env.REFRESH_TOKEN_TTL_SECONDS || '7 * 24 * 3600', 10);

export async function POST(req){
    try {
        
        await connectedDB()

        // read refresh token cookie
        const cookieHeader = req.headers.get('cookie') || '';
        const match = cookieHeader.match(/(?:^|;)\s*refresh_token=([^;]+)/);
        const refreshToken = match ? decodeURIComponent(match[1]) : null;

        if(!refreshToken){
            return NextResponse.json({error: 'No refresh token'}, {status:401});
        }

        const userId =  await consumeRefreshToken(refreshToken);
        if(!userId){
            return NextResponse.json({error: 'Invalid or expired refresh token'}, { status:401});
        }

        //Optionally verify user still exists
        const user = await User.findById(userId).select('_id email role').lean();
        if(!user){
            return NextResponse.json({error: 'User not found'}, { status:401});
        }

        //issue new access token + new refresh token(rotation)
        const accessToken = jwt.sign(
            {_id: user._id, email: user.email, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '15m'}
        );

        const newRefreshToken = await createRefreshToken(user._id, REFRESH_TTL);

        const accessCookie = serialize('access_token', accessToken, {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 15 //15m
        });
        const refreshCookie = serialize('refresh_token', newRefreshToken, {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: REFRESH_TTL
        });

        const res = NextResponse.json({success: 'Token refreshed'}, {status: 200});
        res.headers.set('set-cookie', accessCookie);
        res.headers.append('set-cookie', refreshCookie);
        return res;
    } catch (err) {
      console.error('Refresh error', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });  
    }
}