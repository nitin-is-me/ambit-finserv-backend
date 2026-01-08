/* eslint-disable no-console */
const RateLimit = require('../model/rateLimitModel');

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

class RateLimiter {
  /**
   * Check if an IP is blocked for a specific action type
   * @param {string} ip
   * @param {string} type 'login' or 'otp'
   * @returns {Promise<{blocked: boolean, message?: string, attemptsRemaining?: number, retryAfter?: number}>}
   */
  static async check(ip, type) {
    try {
      const record = await RateLimit.findOne({ip, type});

      if (!record) {
        return {blocked: false};
      }

      if (record.blockedUntil && new Date() < record.blockedUntil) {
        const secondsRemaining = Math.ceil(
          (record.blockedUntil - new Date()) / 1000,
        );
        const minutesRemaining = Math.ceil(secondsRemaining / 60);
        const message = `You have entered incorrect password for maximum number of times, Please try after ${minutesRemaining} minutes.`;
        return {
          blocked: true,
          message,
          retryAfter: secondsRemaining,
        };
      }

      return {
        blocked: false,
        attemptsRemaining: MAX_ATTEMPTS - record.attempts,
      };
    } catch (error) {
      console.error('RateLimiter check error:', error);
      return {blocked: false}; // Fail open if DB error
    }
  }

  /**
   * Increment attempts for an IP
   * @param {string} ip
   * @param {string} type
   * @returns {Promise<{blocked: boolean, attemptsRemaining: number, message?: string}>}
   */
  static async increment(ip, type) {
    try {
      let record = await RateLimit.findOne({ip, type});
      const now = new Date();
      const expiresAt = new Date(now.getTime() + BLOCK_DURATION_MS); // TTL extends on activity

      if (!record) {
        record = await RateLimit.create({
          ip,
          type,
          attempts: 1,
          expiresAt,
        });
      } else {
        // If block expired but record exists (race condition or TTL lag), reset
        if (record.blockedUntil && now > record.blockedUntil) {
          record.attempts = 1;
          record.blockedUntil = null;
        } else {
          record.attempts += 1;
        }
        record.expiresAt = expiresAt;
      }

      if (record.attempts >= MAX_ATTEMPTS) {
        record.blockedUntil = new Date(now.getTime() + BLOCK_DURATION_MS);
        await record.save();
        const message =
          'You have entered incorrect password for maximum number of times, Please try after 10 minutes.';
        return {
          blocked: true,
          attemptsRemaining: 0,
          message,
        };
      }

      await record.save();
      const attemptsRemaining = MAX_ATTEMPTS - record.attempts;

      return {
        blocked: false,
        attemptsRemaining,
        message: `${attemptsRemaining} attempts remaining`,
      };
    } catch (error) {
      console.error('RateLimiter increment error:', error);
      return {blocked: false, attemptsRemaining: 1};
    }
  }

  /**
   * Reset limits on successful action
   * @param {string} ip
   * @param {string} type
   */
  static async reset(ip, type) {
    try {
      await RateLimit.deleteOne({ip, type});
    } catch (error) {
      console.error('RateLimiter reset error:', error);
    }
  }
}

module.exports = RateLimiter;
