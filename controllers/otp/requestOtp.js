/* eslint-disable no-console, prefer-template */
const axios = require('axios');
const OTP = require('../../model/otpModel');
const {
  hashPhoneNumber,
  hashOTP,
  generateOTP,
  generateToken,
  encryptData,
  decryptData,
} = require('../../utils/otpHelpers');

const OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_HOUR = 3;
const HOUR_MS = 60 * 60 * 1000;

/**
 * Send SMS via gateway
 */
async function dispatchSms({mobile, otp}) {
  const smsGatewayUrl =
    process.env.SMS_GATEWAY_URL || 'https://http.myvfirst.com/smpp/sendsms';
  const smsGatewayUsername =
    process.env.SMS_GATEWAY_USERNAME || 'volitnltdhttp';
  const smsGatewayPassword = process.env.SMS_GATEWAY_PASSWORD || 'tion8922';
  const smsSenderId = process.env.SMS_SENDER_ID || 'AMBITF';
  const smsTemplate =
    process.env.SMS_TEMPLATE ||
    'DO NOT SHARE! Your one-time password to apply for business loan with Ambit Finvest is {{OTP}}. It expires in 5 minutes.';

  const message = smsTemplate.replace('{{OTP}}', otp);

  const url = new URL(smsGatewayUrl);
  url.searchParams.set('username', smsGatewayUsername);
  url.searchParams.set('password', smsGatewayPassword);
  url.searchParams.set('to', mobile);
  url.searchParams.set('from', smsSenderId);
  url.searchParams.set('text', message);
  url.searchParams.set('dlr-mask', '19');
  url.searchParams.set('dlr-url', 'null');

  const response = await axios.get(url.toString(), {
    headers: {
      Accept: 'application/json,text/plain,/',
    },
  });

  if (!response || response.status !== 200) {
    throw new Error(
      `Failed to dispatch OTP SMS: ${response?.status || 'Unknown error'}`,
    );
  }

  return response.data;
}

const requestOtp = async (req, res) => {
  try {
    // console.group('🔵 [BACKEND] OTP REQUEST CONTROLLER');
    // console.log('Timestamp:', new Date().toISOString());

    const {
      encryptedPhone,
      phoneHash: providedPhoneHash,
      context = 'public',
    } = req.body;

    // console.log('Step 1: Extract Payload');
    // console.log('   Context:', context);
    // console.log('   Has encryptedPhone:', !!encryptedPhone);
    // console.log('   Has phoneHash:', !!providedPhoneHash);

    // encryptedPhone is required so backend can dispatch SMS; phoneHash may be provided by frontend
    if (!encryptedPhone) {
      console.error('   ❌ Missing encryptedPhone');
      return res.status(400).json({
        success: false,
        message:
          'Phone number is required in encrypted format (encryptedPhone).',
      });
    }
    // console.log('   ✅ Payload extraction complete');
    // Decrypt phone number from frontend for SMS dispatch
    let phoneNumber;
    try {
      if (
        !encryptedPhone ||
        typeof encryptedPhone !== 'object' ||
        !encryptedPhone.encrypted ||
        !encryptedPhone.iv ||
        !encryptedPhone.authTag
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid encrypted phone number format. Missing required fields.',
        });
      }
      // console.log('   Decrypting phone number...');
      const decryptedData = decryptData(encryptedPhone);
      phoneNumber = decryptedData.phone;
      if (!phoneNumber || typeof phoneNumber !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number in encrypted data.',
        });
      }
    } catch (decryptError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid encrypted phone number format. Decryption failed.',
      });
    }
    // console.log('   Decrypted Phone Number:', phoneNumber);
    // Validate phone number
    // console.log('Step 2: Validate Phone Number');
    const normalizedPhone = phoneNumber
      .replace(/^\+91/, '')
      .replace(/\s+/g, '')
      .trim();
    // console.log('   Normalized Phone:', normalizedPhone);
    if (!/^\d{10}$/.test(normalizedPhone)) {
      console.error('   ❌ Invalid phone format');
      console.groupEnd();
      return res.status(400).json({
        success: false,
        message: 'A valid 10 digit mobile number is required.',
      });
    }
    // console.log('   ✅ Phone is valid');

    // Use provided phoneHash if present, otherwise compute server-side
    // console.log('Step 3: Hash Phone Number');
    const phoneHash = providedPhoneHash || hashPhoneNumber(normalizedPhone);
    // console.log('   Phone Hash:', ${phoneHash.substring(0, 20)}...);

    // Check rate limiting - find recent OTP requests for this phone
    // console.log('Step 4: Check Rate Limiting');
    const oneHourAgo = new Date(Date.now() - HOUR_MS);
    // console.log('   Checking requests since:', oneHourAgo);
    // console.log('   Max requests per hour:', MAX_REQUESTS_PER_HOUR);

    const recentRequests = await OTP.find({
      phoneHash,
      context,
      createdAt: {$gte: oneHourAgo},
    }).sort({createdAt: -1});
    // console.log('   Recent requests found:', recentRequests.length);

    // Check if blocked due to wrong attempts
    // console.log('Step 5: Check Blocking Status');
    const latestRecord = recentRequests[0];
    if (
      latestRecord &&
      latestRecord.blockedUntil &&
      new Date() < latestRecord.blockedUntil
    ) {
      const secondsRemaining = Math.ceil(
        (latestRecord.blockedUntil - new Date()) / 1000,
      );
      const minutesRemaining = Math.ceil(secondsRemaining / 60);
      // console.warn('   ⚠ USER IS BLOCKED');
      // console.log('   Blocked Until:', latestRecord.blockedUntil);
      // console.log('   Minutes Remaining:', minutesRemaining);
      // console.log('   Seconds Remaining:', secondsRemaining);
      // console.groupEnd();
      return res.status(429).json({
        success: false,
        message: `Too many wrong OTP attempts. Please try again after ${minutesRemaining} minute(s).`,
        retryAfter: secondsRemaining,
        blockedUntil: latestRecord.blockedUntil,
      });
    }
    // console.log('   ✅ User is not blocked');

    // Check request count in last hour
    // console.log('Step 6: Check Request Rate');
    const requestCount = recentRequests.filter(
      record => !record.verified,
    ).length;
    // console.log('   Unverified requests in last hour:', requestCount);
    // console.log('   Limit:', MAX_REQUESTS_PER_HOUR);

    if (requestCount >= MAX_REQUESTS_PER_HOUR) {
      const oldestRequest = recentRequests[recentRequests.length - 1];
      const waitTime = Math.ceil(
        (HOUR_MS - (Date.now() - oldestRequest.createdAt.getTime())) /
          (60 * 1000),
      );
      // console.error('   ❌ RATE LIMIT EXCEEDED');
      // console.log('   Requests in last hour:', requestCount);
      // console.log('   Must wait:', waitTime, 'minutes');
      // console.groupEnd();
      return res.status(429).json({
        success: false,
        message: `Maximum ${MAX_REQUESTS_PER_HOUR} OTP requests allowed per hour. Please try again after ${waitTime} minute(s).`,
        retryAfter: waitTime * 60,
      });
    }
    // console.log('   ✅ Rate limit check passed');

    // Generate OTP and token
    // console.log('Step 7: Generate OTP & Token');
    const otp = generateOTP();
    const token = generateToken();
    const otpHash = hashOTP(otp, token);
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MS);
    // console.log('   Generated OTP:', otp);
    // console.log('   Generated Token:', ${token.substring(0, 20)}...);
    // console.log('   OTP Hash:', ${otpHash.substring(0, 20)}...);
    // console.log('   Expires At:', expiresAt);

    // Send SMS
    // console.log('Step 8: Send SMS');
    try {
      await dispatchSms({mobile: normalizedPhone, otp, context});
      // console.log('   ✅ SMS dispatched successfully');
    } catch (smsError) {
      // console.error('   ❌ SMS dispatch failed:', smsError.message);
      // console.groupEnd();
      return res.status(500).json({
        success: false,
        message: 'Unable to send OTP at the moment. Please try again later.',
      });
    }

    // Save OTP to database
    // console.log('Step 9: Save OTP Record to Database');
    await OTP.create({
      phoneHash,
      otpHash,
      otp, // Store plain OTP for verification (will be deleted after verification)
      token,
      context,
      expiresAt,
      requestCount: requestCount + 1,
      lastRequestAt: new Date(),
      // Reset wrong attempts if enough time has passed
      wrongAttempts:
        latestRecord &&
        latestRecord.blockedUntil &&
        new Date() >= latestRecord.blockedUntil
          ? 0
          : latestRecord?.wrongAttempts || 0,
    });
    // console.log('   ✅ OTP record created');
    // console.log('   Record ID:', otpRecord._id);

    // Encrypt token for response
    // console.log('Step 10: Prepare Response');
    const encryptedToken = encryptData({
      token,
      expiresAt: expiresAt.getTime(),
    });
    // console.log('   ✅ Token encrypted');

    // console.log('Step 11: Return Success Response');
    // console.log('   Status: 200 OK');
    // console.log('   Token (plain):', ${token.substring(0, 20)}...);
    // console.log('   Expiration: 5 minutes (300 seconds)');
    // console.log(
    //   `   Request count: ${requestCount + 1} / ${MAX_REQUESTS_PER_HOUR}`,
    // );
    // console.log('   ✅✅✅ OTP REQUEST SUCCESSFUL ✅✅✅');
    // console.groupEnd();

    return res.status(200).json({
      success: true,
      token, // Plain token for frontend to store and use in verify request
      encryptedToken, // Encrypted token as backup
      expiresIn: Math.round(OTP_EXPIRATION_MS / 1000),
      cooldown: 60, // 60 seconds cooldown
    });
  } catch (error) {
    // console.error('🔴 [BACKEND] Exception:', error.message);
    // console.groupEnd();
    return res.status(500).json({
      success: false,
      message: 'Unable to send OTP at the moment. Please try again later.',
    });
  }
};

module.exports = requestOtp;
