// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import { serialize } from "cookie";
// import connectedDB from "@/config/database";
// import jwt from "jsonwebtoken"
// import bcrypt from "bcryptjs"
// import { rateLimit, getClientIP } from '@/middleware/rateLimit';

// const limiter = rateLimit({ interval: 60 * 1000 });

// export async function POST(req){
//     try {
//         // Rate limiting - stricter for login
//         const ip = getClientIP(req);
//         await limiter.check(3, ip); // 3 login attempts per minute per IP
        
//         await connectedDB()

//         const {email, password} = await req.json()
//         const user = await User.findOne({email}).select('_id email password role firstName lastName isTrainee').lean()

//         if(!user){
//             return NextResponse.json({error:'User Not Found'}, {status:404})
//         }

//          const isMatchedPassword = await bcrypt.compare(password, user.password)
//         if(!isMatchedPassword){
//             return NextResponse.json({error:'Invalid password or email'}, {status:401})
//         }

//         const token = jwt.sign({_id:user._id, email:user.email, role:user.role}, process.env.JWT_SECRET, { expiresIn:process.env.JWT_EXPIRES_IN } )

//         const cookie = serialize('token', token, {
//             httpOnly:true,
//             secure:process.env.NODE_ENV === 'production',
//             sameSite:'lax',
//             path:'/',
//             maxAge: 60 * 60 * 24 * 7
//         })
        
//         console.log(user)
        
//     const response = NextResponse.json(
//       { success: "User successfully logged in" },
//       { status: 200 }
//     );
//     response.headers.set("Set-Cookie", cookie);
//     return response;
       

//         //return NextResponse.json({success:'User successfully logged in'}, {status:200},{headers:{'Set-Cookie':cookie, 'Content-Type':'application/json'}})
//     } catch (error) {
//       if (error.message === 'Rate limit exceeded') {
//         return NextResponse.json({error:'Too many login attempts. Try again later.'}, {status:429})
//       }
//       console.log('Something went wrong:',error)
//       return NextResponse.json({message:'An error occured'}, {status:500})  
//     }
// }



import { NextResponse } from "next/server";
import { serialize } from "cookie";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectedDB from "@/config/database";
import User from "@/models/User";
import { 
  checkRateLimitIp,
  incrFailedLogin,
  resetFailedLogin,
  isAccountLocked,
  lockAccount,
  createRefreshToken
 } from "@/lib/authHelpers";


 const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
 const MAX_IP = parseInt(process.env.RATE_LIMIT_MAX_IP || '20', '10');
 const MAX_LOGIN_ATTEMPTS_PER_IP = parseInt(process.env.RATE_LIMIT_MAX_LOGIN_ATTEMPTS_PER_IP || '3', 10);
 const FAILED_ATTEMPTS_LIMIT = parseInt(process.env.FAILED_ATTEMPTS_LIMIT || '5', 10);
 const ACCOUNT_LOCK_TTL_SECONDS = parseInt(process.env.ACCOUNT_LOCK_TTL_SECONDS || '900', 10); //15m
 const REFRESH_TTL = parseInt(process.env.REFRESH_TOKEN_TTL_SECONDS || string(7 * 24 * 3600), 10);

 function getClientIP(req){
  const xff = req.headers.get('x-forwarded-for');
  if(xff) return xff.split(',')[0].trim();
  const forwarded = req.headers.get('forwarded');
  if(forwarded) return forwarded;
  return req.headers.get('x-real-ip') || 'unknown';
 }


 export async function POST(req){
  try {
    const ip = getClientIP(req);
    const ipCheck = await checkRateLimitIp(ip, WINDOW_MS, MAX_IP);
    if(!ipCheck.allowed){
      return NextResponse.json({error: 'Too many request from this IP. Try later.'}, { status:429});
    }

    await connectedDB()

    const {email, password} = await req.json();
    if(!email || !password){
      return NextResponse.json({error: 'Missing credentials'}, {status:400});
    }

    //Per-account lock check
    if(await isAccountLocked(email)) {
      return NextResponse.json({error: 'Account locked due to repeated failed attempts. Try later.'}, { status:423});
    }

    const user = await User.findOne({email: email.toLowerCase() }).select('_id email password role firstName lastName').lean();
    if(!user){
       // Avoid leaking whether email exists; still increment IP fail window and possibly account fail counter.
      await incrFailedLogin(email);
      return NextResponse.json({error: 'Invalid email or password'}, {status:401});
    }


    const passwordMatches = await bcrypt.compare(password, user.password);
    if(!passwordMatches){
      const fails = await incrFailedLogin(email);
      if(fails >= FAILED_ATTEMPTS_LIMIT){
         // lock the account temporarily
         await lockAccount(email, ACCOUNT_LOCK_TTL_SECONDS);
      }
      return NextResponse.json({error: 'Invalid email or password'}, { status: 401});
    }

    // success -> reset failed counters
    await resetFailedLogin(email);

    // create access token (short-lived JWT)
    const accessToken = jwt.sign(
      {_id: user._id, email:user.email, role:user.role},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    // create refresh token (opaque, stored in redis)
    const refreshToken = await createRefreshToken(user._id, REFRESH_TTL);

    //cookies

    const accessCookie = serialize('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:'/',
      maxAge: REFRESH_TTL
    });

    // Avoid logging sensitive info in production
    console.log('login success for', user.email);

    const res = NextResponse.json({success: 'User successfully logged in'}, {status:200});
    res.headers.set('set-cookie', accessCookie);
    // To set multiple cookies, append header (Set-Cookie can appear multiple times)
    // NextResponse allows only single header string; join with newline for multiple set-cookie headers
    res.headers.append('set-cookie', refreshToken);
    return res;
  } catch (err) {
    console.error('Login error', err);
    return NextResponse.json({error: 'Server error'}, {status:500})
  }
 }