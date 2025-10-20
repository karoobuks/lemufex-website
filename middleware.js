import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Check for suspicious redirect parameters
  const callbackUrl = searchParams.get('callbackUrl');
  const redirect = searchParams.get('redirect');
  const returnTo = searchParams.get('returnTo');
  
  const suspiciousParams = [callbackUrl, redirect, returnTo].filter(Boolean);
  
  for (const param of suspiciousParams) {
    if (param && isSuspiciousUrl(param)) {
      console.warn(`🚨 Blocked suspicious redirect: ${param}`);
      
      // Redirect to safe page instead
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }
  
  // Security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

function isSuspiciousUrl(url) {
  try {
    // Block external domains
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url);
      const allowedDomains = [
        'localhost',
        '127.0.0.1',
        process.env.APP_URL?.replace(/https?:\/\//, ''),
        ...(process.env.ALLOWED_REDIRECT_DOMAINS?.split(',') || [])
      ].filter(Boolean);
      
      const isAllowed = allowedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
      
      if (!isAllowed) {
        return true;
      }
    }
    
    // Block suspicious patterns
    const suspiciousPatterns = [
      /bedpage/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /%2F%2F/i, // //
      /\/\//,    // //
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(url));
  } catch {
    return true; // Block invalid URLs
  }
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/login',
    '/logout',
    '/api/logout',
  ],
};