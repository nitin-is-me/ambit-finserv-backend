const mongoose = require('mongoose');
const {Schema} = mongoose;

const otpSchema = new Schema(
  {
    phoneHash: {
      type: String,
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    context: {
      type: String,
      default: 'public',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: {expireAfterSeconds: 0},
    },
    verified: {
      type: Boolean,
      default: false,
    },
    // Rate limiting fields
    requestCount: {
      type: Number,
      default: 0,
    },
    lastRequestAt: {
      type: Date,
    },
    wrongAttempts: {
      type: Number,
      default: 0,
    },
    blockedUntil: {
      type: Date,
      default: null,
    },
    lastWrongAttemptAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster lookups
otpSchema.index({phoneHash: 1, context: 1});
otpSchema.index({token: 1});

const OTP = mongoose.model('otp', otpSchema);

module.exports = OTP;
