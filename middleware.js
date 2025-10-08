
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getToken } from "next-auth/jwt";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  let token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const rawToken = req.cookies.get('token')?.value;
    if (rawToken) {
      try {
        const { payload } = await jwtVerify(rawToken, JWT_SECRET);
        token = payload;
      } catch (error) {
        console.error('❌ Invalid custom jwt token in middleware:', error);
      }
    }
  }

  // If no valid token
  if (!token) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url));
  }

  // Block access to /admin if not admin
  if (path.startsWith('/admin') && token.role !== 'admin') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if(path.startsWith("/dashboard")){
      const isAdmin = token.role === "admin";
      const isTrainee = token.isTrainee === true;
     if (!(isAdmin || isTrainee)) {
    return NextResponse.redirect(new URL("/register-training", req.url));
  }
  
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/services',
    '/request-quotes',
    '/why-choose-us',
    '/contact',
    '/dashboard',
    '/dashboard/:path*',
    '/register-training',
    '/trainee-registration-success',
    '/about',
  ]
};
