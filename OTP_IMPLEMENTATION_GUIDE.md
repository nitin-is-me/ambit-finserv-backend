# OTP Implementation Guide - Backend-Driven Architecture

## Overview

The OTP (One-Time Password) functionality has been migrated from frontend-only to a backend-driven architecture with end-to-end encryption. This document explains how to integrate OTP verification into your frontend components.

## Architecture

```
Frontend (React)
    ↓ (encrypted phone number)
Backend OTP Service
    ↓ (decrypt, validate, call SMS gateway)
SMS Gateway (Vonage/Custom)
    ↓ (send SMS with OTP)
User's Phone
    ↓ (user enters OTP in form)
Frontend OTP Input
    ↓ (encrypted OTP + token)
Backend OTP Verification
    ↓ (decrypt, validate, check rate limits, verify hash)
Frontend Application Flow
```

## Security Features

✅ **End-to-End Encryption**: All data transmitted between frontend and backend is encrypted using AES-256-GCM  
✅ **Phone Number Hashing**: Phone numbers are hashed on backend before storage  
✅ **OTP Hashing**: OTPs are never stored in plain text, only hashed  
✅ **Rate Limiting**:

- Max 3 OTP requests per hour per phone number
- Max 5 wrong verification attempts
- 10-minute block after max wrong attempts
  ✅ **Token-Based Tracking**: Each OTP request gets a unique token for session management  
  ✅ **Encrypted Responses**: Verification responses are encrypted for frontend

## Frontend Integration

### 1. Using the OTP Service (Recommended)

#### Basic Usage

```javascript
import {requestOtp, verifyOtp} from '@/services/otpService';

async function handleOtpRequest(phoneNumber) {
  try {
    const result = await requestOtp(phoneNumber);
    console.log('OTP requested:', result);
    // {
    //   token: "unique-token",
    //   encryptedToken: {...},
    //   expiresIn: 300,
    //   cooldown: 60,
    //   success: true
    // }
  } catch (error) {
    console.error('OTP Request failed:', error.message);
  }
}

async function handleOtpVerification(token, otpValue, phoneNumber) {
  try {
    const result = await verifyOtp(token, otpValue, phoneNumber);
    if (result.verified) {
      console.log('OTP verified successfully!');
      // Proceed with application flow
    }
  } catch (error) {
    console.error('OTP Verification failed:', error.message);
    if (error.attemptsRemaining !== undefined) {
      console.log(`Attempts remaining: ${error.attemptsRemaining}`);
    }
  }
}
```

#### Using React Hook (useOtp)

```javascript
import {useOtp} from '@/services/otpService';

function MyComponent() {
  const {
    requestOtpHandler,
    verifyOtpHandler,
    loading,
    error,
    token,
    expiresIn,
    cooldown,
  } = useOtp();

  const handleRequestClick = async () => {
    try {
      await requestOtpHandler(phoneNumber);
      // OTP sent successfully
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleVerifyClick = async () => {
    try {
      const result = await verifyOtpHandler(otpInput, phoneNumber);
      if (result.verified) {
        // Success!
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <button onClick={handleRequestClick} disabled={loading}>
        Request OTP
      </button>
      {expiresIn && <p>OTP expires in: {expiresIn}s</p>}
      <button onClick={handleVerifyClick} disabled={loading}>
        Verify OTP
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### 2. API Endpoints

#### Request OTP

**Endpoint**: `POST /api/otp/request`

**Request**:

```javascript
{
  encryptedPhone: {
    encrypted: "hex-string",
    iv: "hex-string",
    authTag: "hex-string"
  },
  context: "public" // optional, defaults to 'public'
}
```

**Response (Success - 200)**:

```javascript
{
  success: true,
  token: "uuid-token",
  encryptedToken: {
    encrypted: "hex-string",
    iv: "hex-string",
    authTag: "hex-string"
  },
  expiresIn: 300, // seconds
  cooldown: 60 // seconds between requests
}
```

**Response (Rate Limited - 429)**:

```javascript
{
  success: false,
  message: "Maximum 3 OTP requests allowed per hour. Please try again after X minute(s).",
  retryAfter: 3600 // seconds
}
```

#### Verify OTP

**Endpoint**: `POST /api/otp/verify`

**Request**:

```javascript
{
  encryptedToken: {
    encrypted: "hex-string",
    iv: "hex-string",
    authTag: "hex-string"
  },
  encryptedOtp: {
    encrypted: "hex-string",
    iv: "hex-string",
    authTag: "hex-string"
  },
  encryptedPhone: {
    encrypted: "hex-string",
    iv: "hex-string",
    authTag: "hex-string"
  }, // optional, for additional validation
  context: "public" // optional, defaults to 'public'
}
```

**Response (Success - 200)**:

```javascript
{
  success: true,
  verified: true,
  verificationToken: {
    encrypted: "hex-string",
    iv: "hex-string",
    authTag: "hex-string"
  }
}
```

**Response (Wrong OTP - 401)**:

```javascript
{
  success: false,
  message: "Invalid OTP. 3 attempt(s) remaining.",
  attemptsRemaining: 3
}
```

**Response (Blocked - 429)**:

```javascript
{
  success: false,
  message: "Too many wrong OTP attempts. Please try again after 10 minutes.",
  retryAfter: 600
}
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Frontend
NEXT_PUBLIC_BACKEND_URL=https://nupaybiz.com/api
NEXT_PUBLIC_OTP_SECRET_KEY=ambit-otp-secret-key-change-in-production

# Backend
OTP_SECRET_KEY=ambit-otp-secret-key-change-in-production
SMS_GATEWAY_URL=https://http.myvfirst.com/smpp/sendsms
SMS_GATEWAY_USERNAME=volitnltdhttp
SMS_GATEWAY_PASSWORD=tion8922
SMS_SENDER_ID=AMBITF
SMS_TEMPLATE=DO NOT SHARE! Your one-time password to apply for business loan with Ambit Finvest is {{OTP}}. It expires in 5 minutes.
```

## Implementation Examples

### Example 1: Simple Loan Application Form

```javascript
'use client';

import {useState} from 'react';
import {requestOtp, verifyOtp} from '@/services/otpService';

export default function LoanApplicationForm() {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'form'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiresIn, setExpiresIn] = useState(null);

  const handleRequestOtp = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await requestOtp(phoneNumber, 'loan-application');
      setOtpToken(result.token);
      setExpiresIn(result.expiresIn);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await verifyOtp(
        otpToken,
        otpValue,
        phoneNumber,
        'loan-application',
      );
      if (result.verified) {
        setStep('form');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <form onSubmit={handleRequestOtp}>
        <input
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Request OTP'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    );
  }

  if (step === 'otp') {
    return (
      <form onSubmit={handleVerifyOtp}>
        <p>OTP sent to {phoneNumber}</p>
        <p>Expires in {expiresIn} seconds</p>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otpValue}
          onChange={e => setOtpValue(e.target.value)}
          maxLength="6"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button
          type="button"
          onClick={() => setStep('phone')}
          disabled={loading}>
          Change Phone Number
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    );
  }

  return (
    <div>
      <p>Phone number verified: {phoneNumber}</p>
      <p>Proceed with loan application form...</p>
      {/* Rest of form */}
    </div>
  );
}
```

### Example 2: Using in Existing Form

```javascript
'use client';

import {useOtp} from '@/services/otpService';
import {useState} from 'react';

export default function ExistingForm() {
  const {
    requestOtpHandler,
    verifyOtpHandler,
    loading,
    error,
    token,
    expiresIn,
  } = useOtp();

  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
  });

  const [otpStep, setOtpStep] = useState(false);

  const handleRequestOtp = async () => {
    try {
      await requestOtpHandler(formData.phone, 'eligibility-calculator');
      setOtpStep(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const result = await verifyOtpHandler(
        formData.otp,
        formData.phone,
        'eligibility-calculator',
      );
      if (result.verified) {
        // Allow form submission
        handleFormSubmit();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFormSubmit = () => {
    // Continue with form submission
    console.log('OTP verified, proceeding with form submission...');
  };

  return (
    <div>
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={e => setFormData({...formData, phone: e.target.value})}
      />

      {!otpStep ? (
        <button onClick={handleRequestOtp} disabled={loading}>
          Send OTP
        </button>
      ) : (
        <>
          <p>OTP expires in {expiresIn} seconds</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={e => setFormData({...formData, otp: e.target.value})}
            maxLength="6"
          />
          <button onClick={handleVerifyOtp} disabled={loading}>
            Verify OTP
          </button>
        </>
      )}

      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
```

## Migrating Existing Code

### Old Frontend OTP (to be phased out)

```javascript
// OLD - Don't use this anymore
const response = await fetch('/api/otp/request', {
  method: 'POST',
  body: JSON.stringify({mobile: phoneNumber}),
});
```

### New Backend OTP (use this)

```javascript
// NEW - Use this
import {requestOtp} from '@/services/otpService';

const result = await requestOtp(phoneNumber);
```

## Error Handling

```javascript
try {
  const result = await requestOtp(phoneNumber);
} catch (error) {
  // Handle different error scenarios
  if (error.message.includes('Invalid phone number')) {
    // Show validation error
  } else if (error.message.includes('Rate limit')) {
    // Show rate limit message
  } else if (error.message.includes('SMS')) {
    // Show SMS gateway error
  } else {
    // Show generic error
  }
}
```

## Rate Limiting Details

| Limit           | Value      | Action                                  |
| --------------- | ---------- | --------------------------------------- |
| OTP Request     | 3 per hour | Returns 429 when exceeded               |
| Wrong Attempts  | 5 max      | Blocks for 10 minutes after 5th attempt |
| OTP Expiration  | 5 minutes  | OTP becomes invalid                     |
| Resend Cooldown | 60 seconds | Must wait between requests              |

## Database Schema

The backend stores OTP records with:

- `phoneHash` - SHA256 hash of normalized phone number
- `otpHash` - SHA256 hash of OTP with token and secret key
- `token` - Unique session identifier
- `context` - OTP context (loan type, calculator, etc.)
- `expiresAt` - Expiration timestamp
- `wrongAttempts` - Count of failed verification attempts
- `blockedUntil` - Timestamp when user can try again after too many failures
- Auto-deletes after 5 minutes of expiration (TTL index)

## Testing

### Manual Testing Checklist

- [ ] Request OTP with valid 10-digit phone number
- [ ] Request OTP with invalid phone number (should fail)
- [ ] Request OTP 4 times in 1 hour (4th should be rate limited)
- [ ] Verify with correct OTP
- [ ] Verify with wrong OTP 6 times (6th should be blocked)
- [ ] Verify after timeout (should expire)
- [ ] Verify with mismatched phone number
- [ ] Verify with different context

## Troubleshooting

### "Failed to decrypt data" Error

- Ensure `NEXT_PUBLIC_OTP_SECRET_KEY` matches backend `OTP_SECRET_KEY`
- Check that the backend encryption implementation is correct

### "Unable to send OTP" Error

- Check SMS gateway credentials in environment variables
- Verify SMS_GATEWAY_URL is accessible
- Check phone number format (should be 10 digits)

### Rate Limit Issues

- Clear browser cookies if testing with same phone
- Wait 1 hour for request rate limit to reset
- Wait 10 minutes for wrong attempt block to clear

## Support

For issues or questions:

1. Check error messages and logs
2. Verify environment variables are set correctly
3. Ensure backend and frontend secret keys match
4. Check MongoDB connection and OTP collection schema
