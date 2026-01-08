const mongoose = require('mongoose');

const {Schema} = mongoose;

const rateLimitSchema = new Schema(
  {
    ip: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String, // 'login' or 'otp'
      required: true,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    blockedUntil: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: {expireAfterSeconds: 0}, // TTL index
    },
  },
  {
    timestamps: true,
    collection: 'ratelimits', // Explicitly map to existing collection
  },
);

// Compound index for faster lookups
rateLimitSchema.index({ip: 1, type: 1});

const RateLimit = mongoose.model('ratelimit', rateLimitSchema);

module.exports = RateLimit;
