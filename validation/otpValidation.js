const Joi = require('joi');

const requestOtpValidation = Joi.object({
  encryptedPhone: Joi.object({
    encrypted: Joi.string().required(),
    iv: Joi.string().required(),
    authTag: Joi.string().required(),
  }).required(),
  phoneHash: Joi.string().optional(), // Optional: frontend may provide pre-computed hash
  context: Joi.string().optional().default('public'),
});

const verifyOtpValidation = Joi.object({
  encryptedToken: Joi.object({
    encrypted: Joi.string().required(),
    iv: Joi.string().required(),
    authTag: Joi.string().required(),
  }).optional(),
  encryptedOtp: Joi.object({
    encrypted: Joi.string().required(),
    iv: Joi.string().required(),
    authTag: Joi.string().required(),
  }).optional(),
  token: Joi.string().optional(), // Token from hashed flow
  otpHash: Joi.string().optional(), // Hashed OTP from hashed flow
  encryptedPhone: Joi.object({
    encrypted: Joi.string().required(),
    iv: Joi.string().required(),
    authTag: Joi.string().required(),
  }).optional(),
  phoneHash: Joi.string().optional(), // Optional: frontend may provide pre-computed hash
  context: Joi.string().optional().default('public'),
});

module.exports = {
  requestOtpValidation,
  verifyOtpValidation,
};
