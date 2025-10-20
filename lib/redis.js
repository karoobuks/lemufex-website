// let createClient;
// try {
//   createClient = require('redis').createClient;
// } catch (error) {
//   console.log('Redis not available - caching disabled');
// }

// let client;

// export async function getRedisClient() {
//   if (!createClient) {
//     throw new Error('Redis not available');
//   }
  
//   if (!client) {
//     client = createClient({
//       url: process.env.REDIS_URL || 'redis://localhost:6379',
//       socket: {
//         connectTimeout: 60000,
//         lazyConnect: true,
//       },
//       retry_strategy: (options) => {
//         if (options.error && options.error.code === 'ECONNREFUSED') {
//           return new Error('Redis server connection refused');
//         }
//         if (options.total_retry_time > 1000 * 60 * 60) {
//           return new Error('Retry time exhausted');
//         }
//         if (options.attempt > 10) {
//           return undefined;
//         }
//         return Math.min(options.attempt * 100, 3000);
//       }
//     });

//     client.on('error', (err) => console.error('Redis Client Error', err));
//     client.on('connect', () => console.log('✅ Redis Connected'));
//     client.on('ready', () => console.log('✅ Redis Ready'));
//     client.on('end', () => console.log('❌ Redis Connection Ended'));

//     await client.connect();
//   }
//   return client;
// }

// export async function setCache(key, value, ttl = 3600) {
//   if (!createClient) return; // Skip caching if Redis not available
  
//   try {
//     const redis = await getRedisClient();
//     await redis.setEx(key, ttl, JSON.stringify(value));
//   } catch (error) {
//     console.error('Redis SET error:', error);
//   }
// }

// export async function getCache(key) {
//   if (!createClient) return null; // Skip caching if Redis not available
  
//   try {
//     const redis = await getRedisClient();
//     const value = await redis.get(key);
//     return value ? JSON.parse(value) : null;
//   } catch (error) {
//     console.error('Redis GET error:', error);
//     return null;
//   }
// }

// export async function deleteCache(key) {
//   if (!createClient) return; // Skip caching if Redis not available
  
//   try {
//     const redis = await getRedisClient();
//     await redis.del(key);
//   } catch (error) {
//     console.error('Redis DELETE error:', error);
//   }
// }

//lib/redis.js
// import Redis from 'ioredis'

// let redis

// export default function getRedis(){
//   if(!redis){
//     redis = new Redis(process.env.REDIS_URL, {
//       maxRetriesPerRequest: null
//     });
//     redis.on('error', (err) => console.error('Redis error', err));
//   }
//   return redis;
// }

// /lib/redis.js
import Redis from 'ioredis';

let redis;

export default function getRedis() {
  if (!redis) {
    if (!process.env.REDIS_URL) {
      throw new Error('REDIS_URL not set');
    }
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });
    redis.on('error', (err) => console.error('Redis error', err));
    redis.on('connect', () => console.log('Redis connected'));
  }
  return redis;
}
