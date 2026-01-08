# OTP Implementation - Quick Reference Guide

## 🎯 Quick Start (5 minutes)

### For Form Components

```javascript
// 1. Import the service
import {useOtp} from '@/services/otpService';

// 2. Use the hook in your component
function MyForm() {
  const {requestOtpHandler, verifyOtpHandler, loading, error} = useOtp();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  return (
    <div>
      <input
        placeholder="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <button onClick={() => requestOtpHandler(phone)} disabled={loading}>
        Send OTP
      </button>

      <input
        placeholder="OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        maxLength="6"
      />
      <button onClick={() => verifyOtpHandler(otp, phone)} disabled={loading}>
        Verify
      </button>

      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
```

## 📚 API Reference

### `requestOtp(phoneNumber, context?)`

Requests OTP from backend

**Parameters:**

- `phoneNumber` (string): 10-digit phone number
- `context` (string, optional): OTP context (default: 'public')

**Returns:** `{token, expiresIn, cooldown, success}`

**Example:**

```javascript
const result = await requestOtp('9876543210', 'loan-application');
console.log(result.token); // Use this for verification
```

**Errors:**

- Invalid phone number format
- Rate limit exceeded (3 per hour)
- SMS gateway failure

---

### `verifyOtp(token, otp, phoneNumber?, context?)`

Verifies OTP with backend

**Parameters:**

- `token` (string): Token from requestOtp result
- `otp` (string): 6-digit OTP from user
- `phoneNumber` (string, optional): For validation
- `context` (string, optional): Must match requestOtp context

**Returns:** `{verified, success}`

**Example:**

```javascript
const result = await verifyOtp(
  token,
  '123456',
  '9876543210',
  'loan-application',
);
if (result.verified) {
  // OTP verified!
}
```

**Errors:**

- Invalid OTP (401)
- Too many wrong attempts - blocked (429)
- OTP expired (410)
- Token mismatch

---

### `useOtp()`

React hook for OTP management

**Returns:**

```javascript
{
  requestOtpHandler,    // Function to request OTP
  verifyOtpHandler,     // Function to verify OTP
  loading,              // Boolean - is operation in progress
  error,                // String - error message if any
  token,                // String - current OTP token
  expiresIn,            // Number - seconds until expiration
  cooldown,             // Number - seconds until can request again
}
```

---

## 🔐 Security Features

| Feature           | Details                                          |
| ----------------- | ------------------------------------------------ |
| **Encryption**    | AES-256-GCM, all data encrypted in transit       |
| **Phone Hashing** | SHA256 hash, never stored plain text             |
| **OTP Hashing**   | SHA256 hash combined with token + secret         |
| **Token**         | Unique UUID per OTP session                      |
| **Rate Limits**   | 3 requests/hour, 5 wrong attempts = 10 min block |
| **TTL**           | Auto-delete after 5 min expiration               |
| **Context**       | Prevents OTP reuse across forms                  |

---

## ⚡ Common Patterns

### Pattern 1: Two-Step Verification

```javascript
const [step, setStep] = useState('phone'); // 'phone' | 'otp'

if (step === 'phone') {
  return (
    <button
      onClick={() => {
        requestOtpHandler(phone);
        setStep('otp');
      }}>
      Send OTP
    </button>
  );
}

if (step === 'otp') {
  return (
    <button
      onClick={async () => {
        const res = await verifyOtpHandler(otp, phone);
        if (res.verified) {
          setStep('done');
        }
      }}>
      Verify
    </button>
  );
}
```

### Pattern 2: Inline with Form

```javascript
const [otpVerified, setOtpVerified] = useState(false);

return (
  <form
    onSubmit={async e => {
      e.preventDefault();
      if (!otpVerified) {
        const res = await verifyOtpHandler(otp, phone);
        if (res.verified) {
          setOtpVerified(true);
        }
      } else {
        // Submit form
      }
    }}>
    {/* fields */}
    {!otpVerified && <OTPField />}
    <button disabled={!otpVerified}>Submit</button>
  </form>
);
```

### Pattern 3: With Custom Loading State

```javascript
const [isLoading, setIsLoading] = useState(false);
const [customError, setCustomError] = useState('');

const handleOtp = async () => {
  setIsLoading(true);
  setCustomError('');
  try {
    await requestOtpHandler(phone);
  } catch (err) {
    setCustomError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🐛 Debugging

### Enable Console Logging

```javascript
// Add to your component
console.log('OTP Service Debug Info:', {
  requestOtpHandler,
  verifyOtpHandler,
  loading,
  error,
  token,
});
```

### Test Encryption

```javascript
import {encryptData, decryptData} from '@/utils/otpEncryption';

async function testEncryption() {
  const data = {test: 'value'};
  const encrypted = await encryptData(data);
  console.log('Encrypted:', encrypted);

  const decrypted = await decryptData(encrypted);
  console.log('Decrypted:', decrypted);
}
```

### Network Tab

- Check `/api/otp/request` POST request
- Verify response has `token` and `encryptedToken`
- Check `/api/otp/verify` POST request
- Verify response has `verified: true`

### Common Issues

| Issue                     | Solution                                         |
| ------------------------- | ------------------------------------------------ |
| "Invalid phone number"    | Check format: 10 digits, no special chars        |
| "Rate limit exceeded"     | Wait 1 hour before next request                  |
| "OTP has expired"         | Request new OTP (valid for 5 min)                |
| "Decryption failed"       | Check NEXT_PUBLIC_OTP_SECRET_KEY matches backend |
| "Token not found"         | Ensure token is stored from requestOtp           |
| "Too many wrong attempts" | Wait 10 minutes before retrying                  |

---

## 🌍 Environment Setup

### `.env.local` (Frontend)

```env
NEXT_PUBLIC_BACKEND_URL=https://nupaybiz.com/api
NEXT_PUBLIC_OTP_SECRET_KEY=ambit-otp-secret-key-change-in-production
```

### `.env` (Backend)

```env
OTP_SECRET_KEY=ambit-otp-secret-key-change-in-production
SMS_GATEWAY_URL=https://http.myvfirst.com/smpp/sendsms
SMS_GATEWAY_USERNAME=volitnltdhttp
SMS_GATEWAY_PASSWORD=tion8922
SMS_SENDER_ID=AMBITF
```

---

## 📊 Response Examples

### Success - Request OTP (200)

```json
{
  "success": true,
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "encryptedToken": {
    "encrypted": "a1b2c3d4...",
    "iv": "e5f6g7h8...",
    "authTag": "i9j0k1l2..."
  },
  "expiresIn": 300,
  "cooldown": 60
}
```

### Success - Verify OTP (200)

```json
{
  "success": true,
  "verified": true,
  "verificationToken": {
    "encrypted": "m3n4o5p6...",
    "iv": "q7r8s9t0...",
    "authTag": "u1v2w3x4..."
  }
}
```

### Error - Rate Limited (429)

```json
{
  "success": false,
  "message": "Maximum 3 OTP requests allowed per hour. Please try again after 45 minute(s).",
  "retryAfter": 2700
}
```

### Error - Wrong OTP (401)

```json
{
  "success": false,
  "message": "Invalid OTP. 2 attempt(s) remaining.",
  "attemptsRemaining": 2
}
```

### Error - Blocked (429)

```json
{
  "success": false,
  "message": "Too many wrong OTP attempts. Please try again after 10 minutes.",
  "retryAfter": 600
}
```

---

## 📱 Mobile Responsive Tips

```jsx
// Make OTP input mobile-friendly
<input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder="000000"
  maxLength="6"
  autoComplete="one-time-code" // iOS feature
/>;

// Auto-focus OTP field
const otpInputRef = useRef(null);
useEffect(() => {
  otpInputRef.current?.focus();
}, []);

<input ref={otpInputRef} {...otpProps} />;
```

---

## 🔄 Migration Checklist for Existing Forms

For each form using OTP:

1. **Import the service**

   ```javascript
   import {useOtp} from '@/services/otpService';
   ```

2. **Replace old fetch calls**

   ```javascript
   // OLD
   const res = await fetch('/api/otp/request', {...});

   // NEW
   const res = await requestOtp(phone);
   ```

3. **Update error handling**

   ```javascript
   // Catch specific errors
   try {
     await verifyOtpHandler(otp, phone);
   } catch (err) {
     if (err.message.includes('wrong')) {
       // Wrong OTP
     } else if (err.message.includes('expired')) {
       // OTP expired
     }
   }
   ```

4. **Test with backend**
   ```bash
   # Ensure backend is running
   npm run dev  # or npm start
   ```

---

## 💡 Pro Tips

1. **Store token in state, not localStorage**

   - OTP tokens are short-lived (5 min)
   - Session state is safer

2. **Show countdown timer**

   ```javascript
   useEffect(() => {
     if (expiresIn) {
       const timer = setInterval(() => {
         setExpiresIn(e => e - 1);
       }, 1000);
       return () => clearInterval(timer);
     }
   }, [expiresIn]);
   ```

3. **Disable request button during cooldown**

   ```javascript
   <button disabled={cooldown > 0 || loading}>
     {cooldown > 0 ? `Wait ${cooldown}s` : 'Send OTP'}
   </button>
   ```

4. **Handle SMS delivery failures gracefully**
   ```javascript
   try {
     await requestOtpHandler(phone);
   } catch (err) {
     if (err.message.includes('SMS')) {
       showMessage('SMS delivery failed. Please check number.');
     }
   }
   ```

---

## 🚀 Performance Optimization

1. **Memoize handlers** if using in lists
2. **Debounce phone input** before request
3. **Cache encryption key derivation** if possible
4. **Use Web Workers** for encryption if very slow

---

## 📞 Support Resources

- **Full Implementation Guide**: See `OTP_IMPLEMENTATION_GUIDE.md`
- **Migration Checklist**: See `OTP_MIGRATION_CHECKLIST.md`
- **Backend Setup**: See `BACKEND_DOCUMENTATION.md`
- **Frontend Setup**: Check `README.md` in frontend folder

---

## ✅ Summary

The OTP system is now **fully backend-driven** with:

- ✅ End-to-end encryption (AES-256-GCM)
- ✅ Rate limiting (3 requests/hour, 5 attempts/10min)
- ✅ Secure phone number storage (hashed)
- ✅ Secure OTP verification (hashed)
- ✅ Simple frontend integration (useOtp hook)
- ✅ Comprehensive error handling
- ✅ SMS gateway integration
- ✅ TTL-based cleanup

**Start integrating now!** 🚀
