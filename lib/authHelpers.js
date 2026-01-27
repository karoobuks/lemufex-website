// // lib/authHelpers.js
// import getRedis from "./redis";
// import { v4 as uuidv4 } from "uuid";
// import crypto from 'crypto';

// const redis = getRedis();

// export async function incrWindow(key, windowMs, limit) {
//     const res = await redis.incr(key);
//     if(res === 1){
//         await redis.pexpire(key, windowMs);
//     }
//     const ttl = await redis.pttl(key);
//     return { count: res, ttl};
// }

// export async function checkRateLimitIp(ip, windowMs, limit) {
//     const key = `rl:ip:${ip}`;
//     const { count, ttl} = await incrWindow(key, windowMs, limit);
//     return {allowed: count <= limit, remaining: Math.max(0, limit - count), ttl };
// }

// export async function incrFailedLogin(email) {
//     const key = `fail:email:${email.toLowerCase()}`;
//     const res = await redis.incr(key);
//     if(res === 1){
//         await redis.expire(key, 60 * 60)
//     }
//     return res;
// }

// export async function resetFailedLogin(email) {
//   await redis.del(`fail:email:${email.toLowerCase()}`);
// }

// export async function lockAccount(email, ttlSeconds) {
//     await redis.set(`lock:email:${email.toLowerCase()}`, '1', 'EX', ttlSeconds);
// }

// export async function isAccountLocked(email) {
//     const v = await redis.get(`lock:email:${email.toLowerCase()}`);
//     return !!v;
// }

// export async function createRefreshToken(userId, ttlSeconds = 60 * 60 * 24 * 7) {
//     const token = uuidv4() + '.' + crypto.randomBytes(32).toString('hex');
//     const key = `refresh:${token}`;
//     await redis.set(key, userId.toString(), 'EX', ttlSeconds);
//     return token;
// }


// export async function consumeRefreshToken(token){
//     const key = `refresh:${token}`;
//     const userId = await redis.get(key);
//     if(!userId) return null;
//     await redis.del(key);
//     return userId;
// }




// lib/authHelpers.js
import { redis } from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

/**
 * Increment counter with window TTL (rate limiting helper)
 */
export async function incrWindow(key, windowMs) {
  const count = await redis.incr(key);

  // first hit → set expiry
  if (count === 1) {
    await redis.pexpire(key, windowMs);
  }

  // Upstash does NOT support pttl reliably
  // We approximate remaining TTL using windowMs
  return {
    count,
    ttl: windowMs,
  };
}

export async function checkRateLimitIp(ip, windowMs, limit) {
  const key = `rl:ip:${ip}`;
  const { count, ttl } = await incrWindow(key, windowMs);

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    ttl,
  };
}

/**
 * Failed login tracking
 */
export async function incrFailedLogin(email) {
  const key = `fail:email:${email.toLowerCase()}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60 * 60); // 1 hour
  }

  return count;
}

export async function resetFailedLogin(email) {
  await redis.del(`fail:email:${email.toLowerCase()}`);
}

/**
 * Account locking
 */
export async function lockAccount(email, ttlSeconds) {
  await redis.set(
    `lock:email:${email.toLowerCase()}`,
    "1",
    { ex: ttlSeconds }
  );
}

export async function isAccountLocked(email) {
  const value = await redis.get(`lock:email:${email.toLowerCase()}`);
  return Boolean(value);
}

/**
 * Refresh tokens
 */
export async function createRefreshToken(
  userId,
  ttlSeconds = 60 * 60 * 24 * 7
) {
  const token =
    uuidv4() + "." + crypto.randomBytes(32).toString("hex");

  await redis.set(
    `refresh:${token}`,
    userId.toString(),
    { ex: ttlSeconds }
  );

  return token;
}

export async function consumeRefreshToken(token) {
  const key = `refresh:${token}`;
  const userId = await redis.get(key);

  if (!userId) return null;

  await redis.del(key);
  return userId;
}
