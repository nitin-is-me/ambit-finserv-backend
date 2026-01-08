const crypto = require('crypto');

// Secret key for hashing (should be in environment variables)
const OTP_SECRET_KEY =
  process.env.OTP_SECRET_KEY || 'ambit-otp-secret-key-change-in-production';

/**
 * Hash phone number for secure storage and transmission
 */
function hashPhoneNumber(phone) {
  const normalizedPhone = phone.replace(/^\+91/, '').replace(/\s+/g, '').trim();
  return crypto
    .createHash('sha256')
    .update(`${normalizedPhone}:${OTP_SECRET_KEY}`)
    .digest('hex');
}

/**
 * Hash OTP for secure storage
 */
function hashOTP(otp, token) {
  return crypto
    .createHash('sha256')
    .update(`${otp}:${token}:${OTP_SECRET_KEY}`)
    .digest('hex');
}

/**
 * Generate a random 6-digit OTP
 */
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Generate a unique token for OTP session
 */
function generateToken() {
  return crypto.randomUUID();
}

/**
 * Derive key using PBKDF2 (matching frontend implementation)
 * Frontend uses PBKDF2 with 100000 iterations, so we need to match that
 */
function deriveKey(secretKey = OTP_SECRET_KEY) {
  const salt = Buffer.from('salt', 'utf8');
  // Use PBKDF2 to match frontend Web Crypto API implementation
  return crypto.pbkdf2Sync(secretKey, salt, 100000, 32, 'sha256');
}

/**
 * Encrypt data for transmission (AES-256-GCM compatible with Web Crypto API)
 */
function encryptData(data, secretKey = OTP_SECRET_KEY) {
  const algorithm = 'aes-256-gcm';
  const key = deriveKey(secretKey);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(JSON.stringify(data), 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Return separate encrypted data and auth tag (frontend will combine them)
  return {
    encrypted: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

/**
 * Decrypt data received from frontend
 */
function decryptData(encryptedData, secretKey = OTP_SECRET_KEY) {
  try {
    const algorithm = 'aes-256-gcm';
    const key = deriveKey(secretKey);
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');
    const ciphertext = Buffer.from(encryptedData.encrypted, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, null, 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error('Failed to decrypt data');
  }
}

module.exports = {
  hashPhoneNumber,
  hashOTP,
  generateOTP,
  generateToken,
  encryptData,
  decryptData,
};
