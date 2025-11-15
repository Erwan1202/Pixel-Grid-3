const rateLimit = require('express-rate-limit');

if (process.env.NODE_ENV === 'test') {
    const mockLimiter = (req, res, next) => next();
    module.exports = {
        authRateLimiter: mockLimiter,
        pixelRateLimiter: mockLimiter,
    };
} else {
    const authRateLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            message: 'Too many requests, please try again later.',
        },
    });

    const pixelRateLimiter = rateLimit({
        windowMs: 5 * 1000,
        max: 3,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            message: 'Too many pixel updates, wait a minute.',
        },
    });

    module.exports = {
        authRateLimiter,
        pixelRateLimiter,
    };
}