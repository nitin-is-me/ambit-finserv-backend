/* eslint-disable no-console, prefer-template, max-lines */
const OTP = require('../../model/otpModel');
const {
  hashPhoneNumber,
  hashOTP,
  decryptData,
  encryptData,
} = require('../../utils/otpHelpers');
const RateLimiter = require('../../utils/RateLimiter');

const MAX_WRONG_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

const verifyOtp = async (req, res) => {
  try {
    // 0. Check IP Rate Limit First
    const limitCheck = await RateLimiter.check(req.ip, 'otp');
    if (limitCheck.blocked) {
      return res.status(429).json({
        success: false,
        message: limitCheck.message,
        retryAfter: limitCheck.retryAfter,
      });
    }
    // console.group('🔵 [BACKEND] OTP VERIFY CONTROLLER');
    // console.log('Timestamp:', new Date().toISOString());

    const {
      encryptedToken,
      encryptedOtp,
      encryptedPhone,
      token: plainToken,
      otpHash: plainOtpHash,
      phoneHash: providedPhoneHash,
      context = 'public',
    } = req.body;

    // console.log('Step 1: Extract Payload');
    // console.log('   Context:', context);
    // console.log('   Has plainToken:', !!plainToken);
    // console.log('   Has plainOtpHash:', !!plainOtpHash);
    // console.log('   Has phoneHash:', !!providedPhoneHash);

    // Two supported request formats:
    // 1) encryptedToken + encryptedOtp (legacy)
    // 2) token + otpHash (preferred — frontend sends hashed OTP)

    let token;
    let otp; // plaintext otp — may not be present in hashed flow
    let otpHash = null;
    let phoneNumber;
    try {
      // console.log('Step 2: Parse Request Format');
      if (plainToken && plainOtpHash) {
        // hashed flow
        // console.log('   Using HASHED FLOW (token + otpHash)');
        token = plainToken;
        otpHash = plainOtpHash;
        // console.log('   Token:', `${token.substring(0, 20)}...`);
        // console.log('   OTP Hash:', `${plainOtpHash.substring(0, 20)}...`);
      } else {
        // console.log('   Using ENCRYPTED FLOW (encryptedToken + encryptedOtp)');
        if (!encryptedToken || !encryptedOtp) {
          console.error('   ❌ Missing encrypted fields');
          return res.status(400).json({
            success: false,
            message: 'OTP token and value are required.',
          });
        }

        const tokenData = decryptData(encryptedToken);
        token = tokenData.token;

        const otpData = decryptData(encryptedOtp);
        otp = otpData.otp;
        // compute hash from decrypted OTP and token for comparison
        otpHash = null; // will be computed later server-side using hashOTP helper
      }

      if (encryptedPhone) {
        const phoneData = decryptData(encryptedPhone);
        phoneNumber = phoneData.phone;
      }
    } catch (decryptError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid encrypted data format.',
      });
    }

    // If plaintext OTP provided, validate format; when hashed flow used, skip this check
    if (otp && !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be 6 digits.',
      });
    }

    // Find OTP record by token
    const otpRecord = await OTP.findOne({token});

    if (!otpRecord) {
      return res.status(410).json({
        success: false,
        message: 'OTP has expired or is invalid. Please request a new OTP.',
      });
    }

    // Check if blocked due to wrong attempts
    // console.log('Step 3: Check Blocking Status');
    // console.log('   Blocked Until:', otpRecord.blockedUntil);
    // console.log('   Current Time:', new Date());
    if (otpRecord.blockedUntil && new Date() < otpRecord.blockedUntil) {
      const secondsRemaining = Math.ceil(
        (otpRecord.blockedUntil - new Date()) / 1000,
      );
      const minutesRemaining = Math.ceil(secondsRemaining / 60);
      console.warn('   ⚠️ USER IS BLOCKED');
      console.warn('   Minutes Remaining:', minutesRemaining);
      console.warn('   Seconds Remaining:', secondsRemaining);
      console.groupEnd();
      return res.status(429).json({
        success: false,
        message: `Too many wrong OTP attempts. Please try again after ${minutesRemaining} minute(s).`,
        retryAfter: secondsRemaining,
        blockedUntil: otpRecord.blockedUntil,
      });
    }
    // console.log('   ✅ User is not blocked');

    // Check context match
    // console.log('Step 4: Verify Context');
    // console.log('   Expected Context:', otpRecord.context);
    // console.log('   Received Context:', context);
    if (otpRecord.context !== context) {
      console.error('   ❌ Context mismatch');
      console.groupEnd();
      return res.status(403).json({
        success: false,
        message: 'OTP context mismatch.',
      });
    }
    // console.log('   ✅ Context matches');

    // Check if phone matches - either plaintext phone or provided phoneHash can be used
    // console.log('Step 5: Verify Phone Number');
    if (providedPhoneHash) {
      // console.log('   Checking against provided phoneHash');
      // console.log('   Expected:', `${otpRecord.phoneHash.substring(0, 20)}...`);
      // console.log('   Received:', `${providedPhoneHash.substring(0, 20)}...`);
      if (otpRecord.phoneHash !== providedPhoneHash) {
        console.error('   ❌ Phone hash mismatch');
        console.groupEnd();
        return res.status(403).json({
          success: false,
          message: 'Mobile number mismatch.',
        });
      }
    } else if (phoneNumber) {
      // console.log('   Checking against decrypted phone');
      const normalizedPhone = phoneNumber
        .replace(/^\+91/, '')
        .replace(/\s+/g, '')
        .trim();
      const phoneHash = hashPhoneNumber(normalizedPhone);
      // console.log('   Computed Hash:', `${phoneHash.substring(0, 20)}...`);
      // console.log(
      //   '   Stored Hash:',
      //   `${otpRecord.phoneHash.substring(0, 20)}...`,
      // );
      if (otpRecord.phoneHash !== phoneHash) {
        console.error('   ❌ Phone hash mismatch');
        console.groupEnd();
        return res.status(403).json({
          success: false,
          message: 'Mobile number mismatch.',
        });
      }
    }
    // console.log('   ✅ Phone verified');

    // Check expiration
    // console.log('Step 6: Check OTP Expiration');
    // console.log('   Expires At:', otpRecord.expiresAt);
    // console.log('   Current Time:', new Date());
    const isExpired = new Date() > otpRecord.expiresAt;
    console.log('   Expired:', isExpired);
    if (isExpired) {
      console.error('   ❌ OTP has expired');
      await OTP.deleteOne({_id: otpRecord._id});
      console.groupEnd();
      return res.status(410).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
      });
    }
    // console.log('   ✅ OTP is still valid');

    // Compute OTP hash in case plaintext OTP was provided
    if (!otpHash) {
      // plaintext flow: compute hash
      otpHash = hashOTP(otp, token);
    }

    // Verify OTP
    // console.log('Step 7: Compare OTP Hashes');
    // console.log('   Provided Hash:', `${otpHash.substring(0, 20)}...`);
    // console.log(
    //   '   Stored Hash:  ',
    //   `${otpRecord.otpHash.substring(0, 20)}...`,
    // );
    // console.log('   Match:', otpHash === otpRecord.otpHash);

    if (otpHash !== otpRecord.otpHash) {
      // console.warn('   ❌ OTP HASH MISMATCH - WRONG OTP ENTERED');

      // Increment regular record-based attempts
      const wrongAttempts = (otpRecord.wrongAttempts || 0) + 1;

      const updateData = {
        wrongAttempts,
        lastWrongAttemptAt: new Date(),
      };

      // Block if max wrong attempts reached (Record based)
      if (wrongAttempts >= MAX_WRONG_ATTEMPTS) {
        console.error('   ⚠️⚠️⚠️ MAX WRONG ATTEMPTS REACHED (RECORD) ⚠️⚠️⚠️');
        const blockUntil = new Date(Date.now() + BLOCK_DURATION_MS);
        updateData.blockedUntil = blockUntil;
      }

      await OTP.updateOne({_id: otpRecord._id}, updateData);

      // Increment IP-based attempts
      const limitResult = await RateLimiter.increment(req.ip, 'otp');

      // If IP is blocked, return 429 immediately
      if (limitResult.blocked) {
        console.error('   🔴 IP BLOCKED FOR 10 MINUTES');
        return res.status(429).json({
          success: false,
          message: limitResult.message,
          retryAfter: 600,
          attemptsRemaining: 0,
        });
      }

      // Otherwise return 401 with remaining attempts (min of both limits if we wanted, but IP limit is the new "global" one)
      // The user wants "4 attempts remaining, 3...".
      // Existing code returned record-based. I will use the IP-based remaining count if it's lower, or just the IP one?
      // User asked: "toaster while entering incorrect password should be like 4 atempts remaning..."
      // I will prioritize the IP limit message as it's the stricter one potentially across multiple OTPs.

      console.warn('   Return: Invalid OTP with attempts remaining');
      console.groupEnd();
      return res.status(401).json({
        success: false,
        message: `Invalid OTP. ${limitResult.attemptsRemaining} attempt(s) remaining.`,
        attemptsRemaining: limitResult.attemptsRemaining,
      });
    }

    // OTP is correct - SUCCESS!
    // Reset IP limit on success
    await RateLimiter.reset(req.ip, 'otp');

    // OTP is correct - SUCCESS!
    // console.log('Step 9: Mark OTP as Verified');
    // console.log('   ✅✅✅ OTP IS CORRECT ✅✅✅');
    // await OTP.updateOne({_id: otpRecord._id}, {verified: true});
    // Delete after a short delay to allow for any race conditions
    setTimeout(() => {
      OTP.deleteOne({_id: otpRecord._id}).catch(() => {});
    }, 1000);
    // console.log('   OTP record marked verified and scheduled for deletion');

    // Encrypt verification response
    // console.log('Step 10: Prepare Success Response');
    const verificationData = encryptData({
      verified: true,
      phoneHash: otpRecord.phoneHash,
      timestamp: Date.now(),
    });
    // console.log('   ✅ Verification data encrypted');

    // console.log('Step 11: Return Success Response');
    // console.log('   Status: 200 OK');
    // console.log('   Message: OTP Verified Successfully');
    // console.log('   ✅✅✅ OTP VERIFICATION COMPLETE ✅✅✅');
    // console.groupEnd();

    return res.status(200).json({
      success: true,
      verified: true,
      verificationToken: verificationData,
    });
  } catch (error) {
    console.error('🔴 [BACKEND] Exception:', error.message);
    console.groupEnd();
    return res.status(500).json({
      success: false,
      message: 'OTP verification failed.',
    });
  }
};

module.exports = verifyOtp;
