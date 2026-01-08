const rateLimit = require('express-rate-limit');

/**
 * Highly restrictive rate limiter for sensitive endpoints
 * like OTP requests, Login, and Contact forms.
 * Prevents automated scripts from spamming and incurring costs.
 */
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // Limit each IP to 10 requests per hour for these specific routes
  message: {
    success: false,
    message: 'Too many attempts. Please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  sensitiveLimiter,
};
