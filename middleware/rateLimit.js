const rateLimitMap = new Map();

export function rateLimit(options = {}) {
  const {
    interval = 60 * 1000, // 1 minute
    uniqueTokenPerInterval = 500,
  } = options;

  return {
    check: (limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = rateLimitMap.get(token) || [0, Date.now()];
        const [count, lastReset] = tokenCount;
        const now = Date.now();
        const isNewInterval = now - lastReset > interval;

        if (isNewInterval) {
          rateLimitMap.set(token, [1, now]);
          resolve();
        } else if (count < limit) {
          rateLimitMap.set(token, [count + 1, lastReset]);
          resolve();
        } else {
          reject(new Error('Rate limit exceeded'));
        }

        if (rateLimitMap.size > uniqueTokenPerInterval) {
          const oldestEntries = Array.from(rateLimitMap.entries())
            .sort(([, [, a]], [, [, b]]) => a - b)
            .slice(0, rateLimitMap.size - uniqueTokenPerInterval);
          
          oldestEntries.forEach(([key]) => rateLimitMap.delete(key));
        }
      }),
  };
}

export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP.trim();
  return request.ip || 'unknown';
}