const buckets = new Map();

// Clean up expired entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

const rateLimiter = ({ windowMs, max }) => (req, res, next) => {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', max - 1);
    return next();
  }

  current.count += 1;
  const remaining = Math.max(0, max - current.count);
  res.setHeader('X-RateLimit-Limit', max);
  res.setHeader('X-RateLimit-Remaining', remaining);

  if (current.count > max) {
    const retryAfterSec = Math.ceil((current.resetAt - now) / 1000);
    res.setHeader('Retry-After', retryAfterSec);
    return res.status(429).json({ message: '请求过于频繁，请稍后重试。' });
  }

  return next();
};

module.exports = rateLimiter;
