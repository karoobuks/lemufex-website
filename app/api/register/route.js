// import { NextResponse } from "next/server";
// import connectedDB from "@/config/database";
// import User from "@/models/User";
// import bcrypt from 'bcryptjs';
// import { rateLimit, getClientIP } from '@/middleware/rateLimit';
// import { validateRegistration } from '@/middleware/validation';

// const limiter = rateLimit({ interval: 60 * 1000 });

// export async function POST(req){
//     try {
//         // Rate limiting
//         const ip = getClientIP(req);
//         await limiter.check(5, ip); // 5 requests per minute per IP
        
//         await connectedDB()

//         const body = await req.json();
//         const validation = validateRegistration(body);
        
//         if (!validation.isValid) {
//             return NextResponse.json({error: validation.errors.join(', ')}, {status:400});
//         }
        
//         const {firstName, lastName, email, password, phone} = validation.sanitized;

//         const existingUser = await User.findOne({email}).select('_id').lean()

//         if(existingUser){
//             return NextResponse.json({error:'Email already exists'}, {status:409})
//         }

//         const hashedPassword = await bcrypt.hash(password, 10)

//         const newUser = new User({
//            firstName,
//            lastName,
//            email,
//            password:hashedPassword,
//            phone,
            
//         })

//         await newUser.save()
//         return NextResponse.json({success:'User registered successfully'}, {status:201})

//     } catch (error) {
//        if (error.message === 'Rate limit exceeded') {
//          return NextResponse.json({error:'Too many requests. Try again later.'}, {status:429})
//        }
//        console.log('Something went wrong:', error)
//        return NextResponse.json({message:'An error occured'},{status:500}) 
//     }
// }


//app/api/register
import { NextResponse } from 'next/server';
import connectedDB from '@/config/database';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { checkRateLimitIp } from '@/lib/authHelpers'; // from earlier helper file
import { validateRegistration } from '@/middleware/validation';
import getRedis from '@/lib/redis';
import validator from 'validator';

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const MAX_IP = parseInt(process.env.RATE_LIMIT_MAX_IP || '20', 10);
const MAX_SIGNUPS_PER_IP = parseInt(process.env.RATE_LIMIT_MAX_SIGNUPS_PER_IP || '5', 10);
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

function getClientIP(req) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}


// helper: lightweight disposable-email check (example)
function isDisposableEmail(email) {
  // Very small quick check. For production use a reliable list or service.
  const disposableDomains = ['mailinator.com','10minutemail.com','tempmail.io'];
  try {
    const domain = email.split('@')[1].toLowerCase();
    return disposableDomains.includes(domain);
  } catch (e) {
    return false;
  }
}


export async function POST(req) {
  try {
    // 1) shared rate limit by IP (via Redis-backed check)
    const ip = getClientIP(req);
    const ipCheck = await checkRateLimitIp(ip, WINDOW_MS, MAX_IP);
    if (!ipCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests from this IP. Try later.' }, { status: 429 });
    }

        // Additional stricter rate-limit only for signup requests
    const signupIpKey = `signup:ip:${ip}`;
    const { count: signupCount } = await (async () => {
      // use Redis directly for this small check (incr with expiry)
      const redis = getRedis();
      const res = await redis.incr(signupIpKey);
      if (res === 1) await redis.pexpire(signupIpKey, WINDOW_MS);
      const ttl = await redis.pttl(signupIpKey);
      return { count: res, ttl };
    })();
    if (signupCount > MAX_SIGNUPS_PER_IP) {
      return NextResponse.json({ error: 'Too many signup attempts from this IP. Try later.' }, { status: 429 });
    }


      await connectedDB();

    // 2) validate & sanitize input
    const body = await req.json();
    const validation = validateRegistration(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    // use sanitized fields (from your validation)
    let { firstName, lastName, email, password, phone } = validation.sanitized;

    // normalize email to lower-case and trimmed
    email = String(email).trim().toLowerCase();

    // optional: quick disposable email check
    if (isDisposableEmail(email)) {
      return NextResponse.json({ error: 'Disposable emails are not allowed' }, { status: 400 });
    }



       // additional checks: rate-limit per-email (to prevent enumeration / floods)
    const redis = getRedis();
    const emailKey = `signup:email:${email}`;
    const emailAttempts = await redis.incr(emailKey);
    if (emailAttempts === 1) {
      // expire email attempts after, say, 1 hour
      await redis.expire(emailKey, 60 * 60);
    }
    const MAX_SIGNUPS_PER_EMAIL = 3;
    if (emailAttempts > MAX_SIGNUPS_PER_EMAIL) {
      return NextResponse.json({ error: 'Too many signup attempts for this email. Try later.' }, { status: 429 });
    }

    // 3) Check existing user quickly (not the final guard)
    // final guard will be DB unique index + duplicate-key error handling
    const exists = await User.findOne({ email }).select('_id').lean();
    if (exists) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // 4) Hash password (can be CPU heavy — BCRYPT_SALT_ROUNDS is configurable)
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // 5) Create user (rely on DB unique index to prevent duplicates in concurrency)
    // Avoid using findOne-then-save as sole uniqueness guarantee.
    const userDoc = {
      firstName: validator.escape(String(firstName || '')).trim(),
      lastName: validator.escape(String(lastName || '')).trim(),
      email,
      phone: phone ? validator.escape(String(phone)).trim() : undefined,
      password: hashedPassword,
      isEmailVerified: false, // set false and verify by email workflow
      createdAt: new Date()
    };

    try {
      // atomic insert: rely on unique index on email
      const created = await User.create(userDoc);

      // OPTIONAL: create a verification token & send verification email here (recommended)
      if (process.env.EMAIL_VERIFICATION_REQUIRED === 'true') {
        // placeholder: don't block user creation on email sending failures.
        // Implement sendVerificationEmail(userId, email) in your codebase.
        try {
          // Example: await sendVerificationEmail(created._id, created.email)
        } catch (e) {
          // log but don't return error to client (you may schedule a retry)
          console.error('sendVerificationEmail failed', e);
        }
      }

      // Optionally: auto-login after signup (issue tokens like in login handler)
      // For safety, you might prefer requiring email verification first.
      // If you want to auto-login, create access+refresh tokens and set cookies (see login handler).
      // For now, we'll return success without auto-logging-in.
      return NextResponse.json({ success: 'User registered successfully' }, { status: 201 });
    } catch (dbErr) {
      // Handle duplicate key error (E11000) which can occur under concurrency
      // Mongo duplicate key error code is 11000 in many drivers
      const isDuplicateKey = dbErr && dbErr.code === 11000;
      if (isDuplicateKey) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      }
      // other DB errors
      console.error('User creation DB error', dbErr);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  } catch (err) {
    // handle known rate-limit library message if used; fallback generic error
    if (err && err.message === 'Rate limit exceeded') {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
    }
    console.error('Registration error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// local helper to get redis (keeps code readable)
// function getRedis() {
//   return getRedisClient();
// }