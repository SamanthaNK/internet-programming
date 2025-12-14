let authLimiter;
let aiLimiter;

// Try to use express-rate-limit if available; otherwise provide a small in-memory fallback limiter
try {
    const rateLimit = require('express-rate-limit');

    // Auth limiter: 5 requests per 15 minutes per IP
    authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Too many requests from this IP, please try again after 15 minutes.'
        }
    });

    // AI limiter: 10 requests per 1 hour per IP
    aiLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'AI rate limit exceeded. Try again later.'
        }
    });
} catch (err) {
    // Fallback in-memory limiter (not distributed; suitable for dev/testing)
    const stores = {
        auth: new Map(),
        ai: new Map()
    };

    const createFallback = (storeKey, windowMs, max, message) => {
        const store = stores[storeKey];

        return (req, res, next) => {
            try {
                const key = req.ip || req.connection.remoteAddress || 'unknown';
                const now = Date.now();
                const entry = store.get(key) || { count: 0, start: now };

                // reset window
                if (now - entry.start > windowMs) {
                    entry.count = 0;
                    entry.start = now;
                }

                entry.count += 1;
                store.set(key, entry);

                // set rate limit headers similar to express-rate-limit
                res.setHeader('RateLimit-Limit', max);
                res.setHeader('RateLimit-Remaining', Math.max(0, max - entry.count));
                res.setHeader('RateLimit-Reset', Math.ceil((entry.start + windowMs - now) / 1000));

                if (entry.count > max) {
                    return res.status(429).json({ success: false, message });
                }

                return next();
            } catch (e) {
                // On any error, allow the request through to avoid accidental DoS
                console.error('Fallback rate limiter error:', e);
                return next();
            }
        };
    };

    authLimiter = createFallback('auth', 15 * 60 * 1000, 5, 'Too many requests from this IP, please try again after 15 minutes.');
    aiLimiter = createFallback('ai', 60 * 60 * 1000, 10, 'AI rate limit exceeded. Try again later.');
}

module.exports = {
    authLimiter,
    aiLimiter
};
