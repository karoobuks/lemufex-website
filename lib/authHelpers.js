import getRedis from "./redis";
import { v4 as uuidv4 } from "uuid";
import crypto from 'crypto';

const redis = getRedis();

export async function incrWindow(key, windowMs, limit) {
    const res = await redis.incr(key);
    if(res === 1){
        await redis.pexpire(key, windowMs);
    }
    const ttl = await redis.pttl(key);
    return { count: res, ttl};
}

export async function checkRateLimitIp(ip, windowMs, limit) {
    const key = `rl:ip:${ip}`;
    const { count, ttl} = await incrWindow(key, windowMs, limit);
    return {allowed: count <= limit, remaining: Math.max(0, limit - count), ttl };
}

export async function incrFailedLogin(email) {
    const key = `fail:email:${email.toLowerCase()}`;
    const res = await redis.incr(key);
    if(res === 1){
        await redis.expire(key, 60 * 60)
    }
    return res;
}

export async function resetFailedLogin(email) {
  await redis.del(`fail:email:${email.toLowerCase()}`);
}

export async function lockAccount(email, ttlSeconds) {
    await redis.set(`lock:email:${email.toLowerCase()}`, '1', 'EX', ttlSeconds);
}

export async function isAccountLocked(email) {
    const v = await redis.get(`lock:email:${email.toLowerCase()}`);
    return !!v;
}

export async function createRefreshToken(userId, ttlSeconds = 60 * 60 * 24 * 7) {
    const token = uuidv4() + '.' + crypto.randomBytes(32).toString('hex');
    const key = `refresh:${token}`;
    await redis.set(key, userId.toString(), 'EX', ttlSeconds);
    return token;
}


export async function consumeRefreshToken(token){
    const key = `refresh:${token}`;
    const userId = await redis.get(key);
    if(!userId) return null;
    await redis.del(key);
    return userId;
}