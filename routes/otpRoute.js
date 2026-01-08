const router = require('express').Router();
const requestOtp = require('../controllers/otp/requestOtp');
const verifyOtp = require('../controllers/otp/verifyOtp');
const {
  requestOtpValidation,
  verifyOtpValidation,
} = require('../validation/otpValidation');
const {sensitiveLimiter} = require('../middleware/rateLimiter');

router.post(
  '/request',
  sensitiveLimiter, // Protect against OTP spamming
  async (req, res, next) => {
    try {
      await requestOtpValidation.validateAsync(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
  },
  requestOtp,
);

router.post(
  '/verify',
  async (req, res, next) => {
    try {
      await verifyOtpValidation.validateAsync(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
  },
  verifyOtp,
);

module.exports = router;
