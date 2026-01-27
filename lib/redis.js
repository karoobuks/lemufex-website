
// // /lib/redis.js
// import Redis from 'ioredis';

// let redis;

// export default function getRedis() {
//   if (!redis) {
//     if (!process.env.REDIS_URL) {
//       throw new Error('REDIS_URL not set');
//     }
//     redis = new Redis(process.env.REDIS_URL, {
//       maxRetriesPerRequest: null,
//       enableReadyCheck: true,
//     });
//     redis.on('error', (err) => console.error('Redis error', err));
//     redis.on('connect', () => console.log('Redis connected'));
//   }
//   return redis;
// }






// /lib/redis.js
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
