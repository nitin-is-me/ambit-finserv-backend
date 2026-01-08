const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {customErrorMessages} = require('../../utils/helpers');
const {userValidation} = require('../../validation/userValidation');
const userModel = require('../../model/userModel');
const RateLimiter = require('../../utils/RateLimiter');

const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const {error} = userValidation.validate(req.body);

    // 1. Check Rate Limit
    const limitCheck = await RateLimiter.check(req.ip, 'login');
    if (limitCheck.blocked) {
      return res.status(429).json({
        success: false,
        message: limitCheck.message,
        retryAfter: limitCheck.retryAfter,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const user = await userModel.findOne({email});

    if (!user) {
      // Increment on user not found (security practice to prevent enumeration, though slightly debatable on strict login vs generic)
      // User asked for "incorrect password", but blocking IP on invalid users is also standard.
      // I will increment here to be safe and consistent with "brute force" protection.
      const limitResult = await RateLimiter.increment(req.ip, 'login');
      if (limitResult.blocked) {
        return res.status(429).json({
          success: false,
          message: limitResult.message,
          retryAfter: 600,
        });
      }
      return res.status(401).json({
        success: false,
        message: `Invalid username or password. ${limitResult.attemptsRemaining} attempts remaining.`,
      });
    }
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      // 2. Increment on Wrong Password
      const limitResult = await RateLimiter.increment(req.ip, 'login');
      if (limitResult.blocked) {
        return res.status(429).json({
          success: false,
          message: limitResult.message,
          retryAfter: 600,
        });
      }
      return res.status(401).json({
        success: false,
        message: `Invalid username or password. ${limitResult.attemptsRemaining} attempts remaining.`,
      });
    }

    // 3. Reset on Success
    await RateLimiter.reset(req.ip, 'login');

    const token = jwt.sign(
      {userId: user._id, username: user.username},
      process.env.JWT_SECRET,
    );

    res.status(201).json({
      success: true,
      message: 'Logged in successfully',
      token: token,
      user: user,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message});
  }
};

module.exports = login;
