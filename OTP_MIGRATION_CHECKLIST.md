# OTP Migration Checklist

## ✅ Completed Items

### Backend Implementation

- [x] OTP Model created (`model/otpModel.js`)
  - Stores phoneHash, otpHash, token, context, expiresAt
  - Rate limiting fields: requestCount, wrongAttempts, blockedUntil
  - TTL index for auto-deletion after expiration
- [x] OTP Helpers created (`utils/otpHelpers.js`)

  - `hashPhoneNumber()` - SHA256 hash with salt
  - `hashOTP()` - SHA256 hash combining OTP, token, and secret
  - `generateOTP()` - Random 6-digit OTP
  - `generateToken()` - UUID token for session
  - `encryptData()` - AES-256-GCM encryption
  - `decryptData()` - AES-256-GCM decryption
  - PBKDF2 key derivation matching frontend

- [x] Request OTP Controller (`controllers/otp/requestOtp.js`)
  - Validates encrypted phone number from frontend
  - Decrypts phone number
  - Checks rate limiting (max 3 requests per hour)
  - Sends OTP via SMS gateway (Vonage/myvfirst)
  - Saves OTP to database with hashing
  - Returns plain token + encrypted token to frontend
- [x] Verify OTP Controller (`controllers/otp/verifyOtp.js`)
  - Validates encrypted OTP and token from frontend
  - Decrypts received data
  - Checks rate limiting on wrong attempts (max 5, 10-min block)
  - Verifies OTP hash matches stored hash
  - Returns encrypted verification response
- [x] OTP Validation (`validation/otpValidation.js`)
  - Validates request structure with Joi schema
  - Requires encrypted data format: {encrypted, iv, authTag}
- [x] OTP Routes (`routes/otpRoute.js`)
  - POST /otp/request - Request OTP
  - POST /otp/verify - Verify OTP
  - Routes properly integrated in index.js

### Frontend Implementation

- [x] OTP Encryption Utility (`src/utils/otpEncryption.js`)
  - Web Crypto API for AES-256-GCM encryption
  - PBKDF2 key derivation (100,000 iterations)
  - Converts between hex and bytes
- [x] OTP Service (`src/services/otpService.js`)
  - `requestOtp()` - Call backend with encrypted phone
  - `verifyOtp()` - Call backend with encrypted OTP and token
  - `useOtp()` - React hook for state management
  - Error handling with proper error messages
- [x] Environment Variables Ready
  - NEXT_PUBLIC_BACKEND_URL
  - NEXT_PUBLIC_OTP_SECRET_KEY

## 🔄 Next Steps - Update Existing Forms

The following pages need to be updated to use the new OTP service:

1. **src/app/(client)/topup-loan/page.js**
   - Replace `/api/otp/request` and `/api/otp/verify` calls
   - Import from `@/services/otpService`
2. **src/app/(client)/apply/unsecured-business-loan/loan.js**
   - Update OTP calls to backend service
3. **src/app/(client)/apply/secured-business-loan/secured-buiness-loan.js**
   - Update OTP calls to backend service
4. **src/app/(client)/apply/parivahan/used-car-loan/usedCarLoan.js**
   - Update OTP calls to backend service
5. **src/app/(client)/apply/parivahan/used-commercial-vehicle-loan/usedCommercialLoan.js**
   - Update OTP calls to backend service
6. **src/app/(client)/eligibility-calculator-form/eligibility-calculator-form.js**
   - Update OTP calls to backend service
7. **src/app/(client)/connector-onboarding/connector_onboarding.js**
   - Update OTP calls to backend service
8. **src/components/Footer/index.js**
   - If using OTP for NACH mandate, update to use backend
9. **Test Variants**
   - Update all test files in `src/app/(client)/test/` folder

## 📋 Migration Steps for Each Form

### Before

```javascript
// Old frontend OTP
const response = await fetch('/api/otp/request', {
  method: 'POST',
  body: JSON.stringify({mobile: phoneNumber}),
});
const data = await response.json();
const token = data.token;

// Later...
const verifyResponse = await fetch('/api/otp/verify', {
  method: 'POST',
  body: JSON.stringify({token, otp: otpValue}),
});
```

### After

```javascript
// New backend OTP
import {requestOtp, verifyOtp} from '@/services/otpService';

// Request OTP
const result = await requestOtp(phoneNumber, 'context-name');
const token = result.token;

// Later...
const verifyResult = await verifyOtp(
  token,
  otpValue,
  phoneNumber,
  'context-name',
);
if (verifyResult.verified) {
  // Proceed with form
}
```

## 🔒 Security Improvements

- [x] **Encrypted Data Transit**: All data encrypted with AES-256-GCM
- [x] **Phone Number Hashing**: Never stored in plain text
- [x] **OTP Hashing**: Never stored in plain text, only hash
- [x] **Token-Based Sessions**: Prevents CSRF and session hijacking
- [x] **Rate Limiting**: Protects against brute force attacks
  - Max 3 OTP requests per hour per phone
  - Max 5 wrong verification attempts (10-min block)
- [x] **Automatic Cleanup**: OTP records auto-delete after expiration (TTL)
- [x] **PBKDF2 Key Derivation**: Industry-standard key derivation
- [x] **Context Validation**: Prevents OTP reuse across different contexts
- [x] **Expiration**: OTP valid for only 5 minutes

## 🧪 Testing Checklist

Before deploying, test these scenarios:

### Happy Path

- [ ] User enters valid 10-digit phone number
- [ ] OTP request succeeds
- [ ] User receives SMS with OTP
- [ ] User enters correct OTP
- [ ] OTP verification succeeds
- [ ] User can proceed with application

### Error Cases

- [ ] User enters invalid phone number (not 10 digits)
- [ ] User requests OTP more than 3 times in 1 hour
- [ ] User enters wrong OTP
- [ ] User enters wrong OTP 5 times (should be blocked)
- [ ] User tries to verify after 5 minutes (OTP expired)
- [ ] User changes phone number (mismatch error)
- [ ] SMS gateway is down (error handling)

### Rate Limiting

- [ ] Confirm 3 OTP requests per hour limit
- [ ] Confirm 5 wrong attempts block for 10 minutes
- [ ] Confirm error messages include retry time

### Encryption

- [ ] Verify data is encrypted between frontend and backend
- [ ] Verify decryption works correctly
- [ ] Verify mismatched keys cause decryption errors

## 📚 Documentation

- [x] **OTP_IMPLEMENTATION_GUIDE.md** - Complete implementation guide with examples
- [x] **README.md** (backend) - Architecture overview
- [x] **This file** - Migration checklist

## 🚀 Deployment Checklist

Before going live:

- [ ] Update all forms to use new OTP service
- [ ] Test all OTP flows with actual SMS gateway
- [ ] Ensure NEXT_PUBLIC_BACKEND_URL is set correctly in production
- [ ] Ensure OTP_SECRET_KEY is set identically in frontend and backend
- [ ] Set secure environment variables on production servers
- [ ] Test encryption with production keys
- [ ] Monitor error logs for any decryption failures
- [ ] Monitor rate limiting effectiveness
- [ ] Set up SMS gateway monitoring
- [ ] Prepare rollback plan in case of issues

## 📝 Notes

- All phone numbers are stored as hashes (SHA256) in database
- OTPs are never stored in plain text
- Each OTP request gets a unique token
- OTP records auto-delete from database after 5 minutes
- Wrong attempt counter increments per OTP session
- Block period applies globally to a phone number within 10 minutes
- Encryption uses Web Crypto API (browser-native, no external libs)
- PBKDF2 iteration count is 100,000 (OWASP recommended minimum)

## 🔗 Related Files

Backend:

- `controllers/otp/requestOtp.js`
- `controllers/otp/verifyOtp.js`
- `model/otpModel.js`
- `utils/otpHelpers.js`
- `validation/otpValidation.js`
- `routes/otpRoute.js`
- `.env` (SMS and encryption config)

Frontend:

- `src/utils/otpEncryption.js`
- `src/services/otpService.js`
- `.env.local` (Backend URL and secret key)

Legacy (to be phased out):

- `src/app/api/otp/request/route.js` (old frontend OTP)
- `src/app/api/otp/verify/route.js` (old frontend OTP)

## ⚠️ Important Reminders

1. **DO NOT** expose OTP*SECRET_KEY in frontend code (use NEXT_PUBLIC* prefix only for non-sensitive data)
2. **DO NOT** store OTP in plain text
3. **DO NOT** skip encryption for data transmission
4. **DO NOT** allow unlimited OTP requests
5. **DO NOT** reuse OTP tokens across different contexts
6. **ALWAYS** validate phone number format on both frontend and backend
7. **ALWAYS** use HTTPS in production
8. **ALWAYS** keep encryption keys confidential
