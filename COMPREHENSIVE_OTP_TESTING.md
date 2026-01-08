# OTP System - Complete Testing Checklist

## Pre-Testing Setup

### 1. Environment Variables Check

```bash
# Backend (.env in ambit-backend/ambit-finserv-backend/)
MONGODB_URI=your_mongo_connection
SMS_GATEWAY_URL=https://http.myvfirst.com/smpp/sendsms
SMS_GATEWAY_USERNAME=volitnltdhttp
SMS_GATEWAY_PASSWORD=tion8922
SMS_SENDER_ID=AMBITF

# Frontend (.env.local in ambit-frontend/ambit-finserv-web/)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/v1
```

### 2. Server Status

- Backend server running on port 8000? `http://localhost:8000`
- Frontend server running on port 3000? `http://localhost:3000`
- MongoDB running?

---

## Test Suite

### Test 1: OTP Request - Happy Path ✅

**Objective:** Verify successful OTP request flow

**Steps:**

1. Open browser DevTools (F12) → Console tab
2. Clear console
3. Enter valid 10-digit phone number in OTP form
4. Click "Send OTP"

**Expected Console Output:**

```
📱 OTP Service Initialized
   Backend URL: http://localhost:8000/api/v1
   Request Endpoint: /otp/request
   Verify Endpoint: /otp/verify

🔵 [OTP REQUEST START]
Step 1: Input Validation
   Phone Number: 9876543210
   Context: public
   Normalized Phone: 9876543210

Step 2: Hashing Phone Number
   Phone Hash: abc123def456abc123def456...

Step 3: Encrypting Phone Number
   Encrypted Phone Keys: encrypted,iv,authTag

Step 4: Preparing Request
   Endpoint: http://localhost:8000/api/v1/otp/request
   Method: POST
   Payload Keys: phoneHash,encryptedPhone,context

Step 5: Sending Request to Backend

Step 6: Response Received
   Status: 200 OK

Step 7: Success Response
   Token: xyz789abc123...
   Expires In: 300000 ms
   Cooldown: 60 ms

✅ OTP Requested Successfully
```

**Expected Backend Output:**

```
🔵 [BACKEND] OTP REQUEST CONTROLLER
Timestamp: 2025-12-16T10:30:45.123Z

Step 1: Extract Payload
   Context: public
   Has encryptedPhone: true
   Has phoneHash: true

Step 2: Decrypt Phone Number
   ✅ Decrypted Phone: 9876543210

Step 3: Validate Phone
   Normalized: 9876543210

Step 4: Hash Phone
   Phone Hash: abc123def456...

Step 5: Check Rate Limiting
   Recent Requests: 0
   Request Count: 0 (Max: 3 per hour)
   ✅ Within rate limit

Step 6: Generate OTP & Token
   OTP: 123456
   Token: xyz789...
   Expires At: 2025-12-16T10:35:45.123Z

Step 7: Send SMS
   ✅ SMS sent successfully

Step 8: Save to Database
   ✅ OTP saved to MongoDB

Step 9: Encrypt Token for Response
   ✅ Token encrypted

Step 10: Send Response
   ✅ OTP Request Successful
```

**Network Tab Check:**

- ✅ POST request to `http://localhost:8000/api/v1/otp/request`
- ✅ Status: 200 OK
- ✅ Response body contains: `token`, `expiresIn`, `cooldown`

**Form Feedback:**

- ✅ OTP input field appears
- ✅ "OTP expires in: 5:00" countdown starts
- ✅ "Send OTP" button disabled/cooldown shows

**Verification Passed:** 🟢 When all above checks pass

---

### Test 2: OTP Verification - Correct OTP ✅

**Objective:** Verify successful OTP verification with correct OTP

**Prerequisites:**

- OTP successfully requested in Test 1
- Phone should have received SMS with OTP (or check backend logs for OTP value)

**Steps:**

1. Enter the 6-digit OTP received
2. Click "Verify OTP"

**Expected Console Output:**

```
🔵 [OTP VERIFY START]

Step 1: Input Validation
   Token: xyz789abc123...
   OTP: ****6 (masked for security)
   Phone Number: N/A
   Context: public

Step 2: Hashing OTP
   OTP Hash: def456abc123...

Step 3: Preparing Request
   Endpoint: http://localhost:8000/api/v1/otp/verify
   Method: POST
   Payload Keys: token,otpHash,context

Step 4: Sending Request to Backend

Step 5: Response Received
   Status: 200 OK

Step 6: Success Response
   Verified: true
   ✅ OTP Verified Successfully
```

**Expected Backend Output:**

```
🔵 [BACKEND] OTP VERIFY CONTROLLER
Timestamp: 2025-12-16T10:31:15.234Z

Step 1: Extract Payload
   Context: public
   Has plainToken: true
   Has plainOtpHash: true

Step 2: Parse Request Format
   Using HASHED FLOW (token + otpHash)

Step 3: Find OTP Record
   ✅ OTP Found

Step 4: Check Block Status
   ✅ Not blocked

Step 5: Check Expiration
   ✅ Not expired

Step 6: Validate Phone Hash
   ✅ Phone matches

Step 7: Verify OTP Hash
   Provided Hash: def456abc123def456abc123...
   Stored Hash:   def456abc123def456abc123...
   ✅ Hashes match

Step 8: Mark Verified & Delete
   ✅ OTP verified and deleted from database

Step 9: Send Success Response
   ✅ OTP Verification Complete
```

**Network Tab Check:**

- ✅ POST request to `http://localhost:8000/api/v1/otp/verify`
- ✅ Status: 200 OK
- ✅ Response body contains: `verified: true`, `verificationToken`

**Form Feedback:**

- ✅ Success message displayed
- ✅ Form submitted/moved to next step
- ✅ Error counters cleared

**Verification Passed:** 🟢 When both console and form show success

---

### Test 3: OTP Verification - Wrong OTP (First Attempt) ❌

**Objective:** Verify error handling for first wrong OTP attempt

**Prerequisites:**

- OTP successfully requested

**Steps:**

1. Enter incorrect OTP (not the one received)
2. Click "Verify OTP"

**Expected Console Output:**

```
🔵 [OTP VERIFY START]

Step 1: Input Validation
   Token: xyz789abc123...
   OTP: ****0 (wrong number)
   Context: public

Step 2: Hashing OTP
   OTP Hash: wrong789xyz000...

Step 3: Preparing Request
   [sent to backend]

Step 4: Response Received
   Status: 401 Unauthorized

Step 5: Error Response
   Message: Invalid OTP
   Attempts Remaining: 4
   Retry After: null (null because not blocked yet)
```

**Expected Backend Output:**

```
Step 7: Verify OTP Hash
   Provided Hash: wrong789xyz000...
   Stored Hash:   def456abc123def456abc123...
   ⚠️ OTP Hash mismatch - WRONG OTP
   Wrong Attempt #: 1
   Attempts Remaining: 4
   [Sending: Invalid OTP error]
```

**Form Feedback:**

- ✅ Error message: "Invalid OTP"
- ✅ Counter shows: "Attempts remaining: 4"
- ✅ OTP input still editable for retry

**Verification Passed:** 🟢 When attempts counter correctly shows 4

---

### Test 4: OTP Verification - 5 Wrong Attempts (Blocking) 🔒

**Objective:** Verify blocking after 5 wrong OTP attempts

**Prerequisites:**

- OTP successfully requested
- Have made 4 wrong attempts already

**Steps:**

1. Enter another wrong OTP (5th attempt)
2. Click "Verify OTP"

**Expected Console Output:**

```
Step 5: Response Received
   Status: 429 Too Many Requests

Step 6: Error Response
   Message: Too many wrong OTP attempts. Try again after 15 minutes
   Attempts Remaining: 0
   Retry After: 900 (seconds = 15 minutes)
```

**Expected Backend Output:**

```
Step 7: Verify OTP Hash
   ⚠️ OTP Hash mismatch - WRONG OTP
   Wrong Attempt #: 5
   ⚠️ MAX ATTEMPTS REACHED - BLOCKING FOR 15 MINUTES
   Blocking user for 15 minutes
   Blocked Until: 2025-12-16T10:46:15.234Z
```

**Form Feedback:**

- ✅ Error message: "Too many wrong OTP attempts. Try again after 15 minutes"
- ✅ Counter shows: "Attempts remaining: 0"
- ✅ OTP input might be disabled (blocked)
- ✅ Retry button shows: "Try again in 15:00"

**Verification Passed:** 🟢 When blocked message appears with 900-second retry time

---

### Test 5: OTP Verification - Blocked User Retry ⏳

**Objective:** Verify blocked user cannot retry before 15 minutes

**Prerequisites:**

- User blocked from Test 4
- Blocked until timestamp still in future

**Steps:**

1. Try to enter another OTP while blocked
2. Click "Verify OTP"

**Expected Console Output:**

```
Step 4: Response Received
   Status: 429 Too Many Requests

Step 5: Error Response
   Message: User blocked. Try again after 15 minutes
   Retry After: 850 (remaining seconds until unblocked)
```

**Expected Backend Output:**

```
Step 4: Check Block Status
   ⚠️ User blocked until: 2025-12-16T10:46:15.234Z
   Wait time: 14 minutes 50 seconds
   [Rejecting request - user blocked]
```

**Form Feedback:**

- ✅ Same blocking message appears
- ✅ Retry timer shows remaining time (decreases)

**Verification Passed:** 🟢 When blocked status persists for full 15 minutes

---

### Test 6: Rate Limiting - 3 OTP Requests Per Hour 🔄

**Objective:** Verify rate limiting (max 3 requests per hour)

**Prerequisites:**

- Fresh test window
- No previous OTP requests

**Steps:**

1. Request OTP (Request #1)
   - ✅ Should succeed
2. Wait a few seconds
3. Request OTP again (Request #2)
   - ✅ Should succeed
4. Wait a few seconds
5. Request OTP again (Request #3)
   - ✅ Should succeed
6. Wait a few seconds
7. Request OTP again (Request #4)
   - ❌ Should be rate-limited

**Expected Console on Request #4:**

```
Step 5: Response Received
   Status: 429 Too Many Requests

Step 6: Error Response
   Message: You can only request 3 OTPs in 1 hour. Try again after 59 minutes
   Retry After: 3540 (seconds)
```

**Expected Backend Output on Request #4:**

```
Step 5: Check Rate Limiting
   Recent Requests: 3
   Request Count: 3 (Max: 3 per hour)
   ⚠️ Rate limit: 3 requests in last hour
   Wait time: 59 minutes 59 seconds
   [Rejecting request - rate limited]
```

**Form Feedback:**

- ✅ First 3 requests show "OTP expires in: 5:00"
- ✅ 4th request shows: "You can only request 3 OTPs in 1 hour"
- ✅ Retry button shows: "Try again in 59:59"

**Verification Passed:** 🟢 When 4th request is blocked with 3540+ second retry time

---

### Test 7: OTP Expiration - 5 Minutes ⏱️

**Objective:** Verify OTP expires after 5 minutes

**Prerequisites:**

- OTP successfully requested
- No verification attempt yet

**Steps:**

1. Wait 5+ minutes
2. Enter the OTP
3. Click "Verify OTP"

**Expected Console Output:**

```
Step 5: Response Received
   Status: 401 Unauthorized

Step 6: Error Response
   Message: OTP has expired. Please request a new one
```

**Expected Backend Output:**

```
Step 5: Check Expiration
   ❌ OTP expired
   OTP sent at: 2025-12-16T10:30:00.000Z
   Expired at: 2025-12-16T10:35:00.000Z
   Current time: 2025-12-16T10:35:30.000Z
   [Rejecting - expired]
```

**Form Feedback:**

- ✅ Error message: "OTP has expired. Please request a new one"
- ✅ Countdown shows "0:00" or expired message
- ✅ "Send OTP" button re-enabled

**Verification Passed:** 🟢 When OTP verification fails after 5 minutes with expiration message

---

### Test 8: Hash Verification - Visual Debugging 🔐

**Objective:** Verify hash comparison logging

**Prerequisites:**

- Both correct and wrong OTP tests completed

**Steps:**

1. In browser console, search for "Step 7: Verify OTP Hash" or "Step 9: Verify OTP Hash"
2. Review the logs showing:
   - "Provided Hash: "
   - "Stored Hash: "

**Example Correct Match:**

```
Step 9: Verify OTP Hash
   Provided Hash: abc123def456abc123def456...
   Stored Hash:   abc123def456abc123def456...
   ✅ Hashes match
```

**Example Wrong Mismatch:**

```
Step 9: Verify OTP Hash
   Provided Hash: wrong789xyz000abc123def456...
   Stored Hash:   abc123def456abc123def456...
   ⚠️ OTP Hash mismatch - WRONG OTP
   Wrong Attempt #: 1
```

**Verification Passed:** 🟢 When hash values are clearly visible for debugging

---

## Test Summary Checklist

| Test # | Scenario                 | Expected                   | Status |
| ------ | ------------------------ | -------------------------- | ------ |
| 1      | OTP Request - Happy Path | 200 OK, token returned     | ⬜     |
| 2      | Correct OTP Verification | 200 OK, verified: true     | ⬜     |
| 3      | First Wrong Attempt      | 401, attempts remaining: 4 | ⬜     |
| 4      | 5th Wrong Attempt        | 429, attempts remaining: 0 | ⬜     |
| 5      | Blocked User Retry       | 429, blocked message       | ⬜     |
| 6      | Rate Limit (4th request) | 429, rate limited message  | ⬜     |
| 7      | OTP Expiration           | 401, expired message       | ⬜     |
| 8      | Hash Debugging           | Hashes visible in logs     | ⬜     |

---

## Common Issues & Fixes

### Issue: Frontend calling localhost:3000 instead of localhost:8000

**Symptom:**

```
POST http://localhost:3000/api/otp/verify 404 Not Found
```

**Fix:**

```javascript
// In src/services/otpService.js, line 10:
const BACKEND_BASE_URL = 'http://localhost:8000/api/v1'; // MUST be hardcoded or from env
```

**Verify:**

- ✅ Check Network tab - URL should be `localhost:8000`

---

### Issue: Hydration Errors in Console

**Symptom:**

```
Warning: In HTML, whitespace text nodes cannot be a child of <html>
```

**Notes:**

- This is unrelated to OTP system
- It's a Next.js layout/component issue
- OTP flow will still work despite this warning

---

### Issue: OTP Never Arrives (SMS Not Sent)

**Symptom:**

```
Backend shows: Step 7: Send SMS ❌ (error message)
```

**Checks:**

1. Verify SMS gateway credentials in `.env`
   - SMS_GATEWAY_USERNAME
   - SMS_GATEWAY_PASSWORD
2. Check phone number format (should be 10 digits)
3. Check SMS gateway API status
4. Look at backend error logs for specific error

---

### Issue: Database Connection Error

**Symptom:**

```
Step 8: Save to Database ❌ (MongoDB error)
```

**Checks:**

1. MongoDB is running: `mongod`
2. Connection string is correct in `.env`
3. Database and OTP collection exist

---

### Issue: Encryption/Decryption Failing

**Symptom:**

```
Step 2: Decrypt Phone Number ❌ (Cipher error)
```

**Checks:**

1. Verify encryption key is consistent
2. Check otpEncryption utils are working
3. Review `utils/otpEncryption.js` for errors

---

## Performance Benchmarks

| Operation        | Expected Time | Actual Time |
| ---------------- | ------------- | ----------- |
| Phone hashing    | < 100ms       | ⬜          |
| Phone encryption | < 50ms        | ⬜          |
| Backend request  | < 2s          | ⬜          |
| SMS dispatch     | < 5s          | ⬜          |
| OTP verification | < 1s          | ⬜          |

---

## Final Sign-Off

When all tests pass:

- ✅ OTP request working
- ✅ OTP verification working
- ✅ Rate limiting enforced (3 per hour)
- ✅ Wrong attempt blocking (5 attempts = 15 min block)
- ✅ OTP expiration working (5 minutes)
- ✅ Logging visible for debugging
- ✅ Backend URL correct (8000, not 3000)

**System Status:** 🟢 **READY FOR PRODUCTION**
