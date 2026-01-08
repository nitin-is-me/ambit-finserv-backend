# What to Send from Frontend - Simple Guide

## 🎯 TL;DR

**Nothing is required!** The API works perfectly without any changes.

**But to get better insights, send these optional headers.**

---

## 📦 Copy-Paste Solution

### **1. Copy this JavaScript code to your frontend**

```javascript
// File: src/utils/cibilApiHeaders.js

export const getCibilHeaders = () => {
  const ua = navigator.userAgent;

  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  // Detect OS
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'MacOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iOS')) os = 'iOS';

  // Detect device
  let device = 'desktop';
  if (/Mobile|Android|iPhone/i.test(ua)) device = 'mobile';
  else if (/iPad|Tablet/i.test(ua)) device = 'tablet';

  // Get network info (if available)
  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const connectionType = conn?.type || 'unknown';
  const effectiveType = conn?.effectiveType || 'unknown';
  const downlink = (conn?.downlink || 0).toString();
  const rtt = (conn?.rtt || 0).toString();

  // Session ID
  let sessionId = sessionStorage.getItem('cibil_session');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('cibil_session', sessionId);
  }

  return {
    'Content-Type': 'application/json',
    'X-Browser': browser,
    'X-OS': os,
    'X-Device-Type': device,
    'X-Screen-Resolution': `${window.screen.width}x${window.screen.height}`,
    'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    'X-Connection-Type': connectionType,
    'X-Effective-Type': effectiveType,
    'X-Downlink': downlink,
    'X-RTT': rtt,
    'X-Session-ID': sessionId,
  };
};
```

---

### **2. Use it in your API calls**

#### **React Example:**

```javascript
import {getCibilHeaders} from './utils/cibilApiHeaders';

// Create user
const createUser = async userData => {
  const response = await fetch('https://your-api.com/api/cibil-score/add', {
    method: 'POST',
    headers: {
      ...getCibilHeaders(),
      'X-Action-Type': 'create_user', // Optional: what action is this
    },
    body: JSON.stringify(userData),
  });

  return response.json();
};

// Update user
const updateUser = async (userId, updateData) => {
  const response = await fetch('https://your-api.com/api/cibil-score/update', {
    method: 'PUT',
    headers: {
      ...getCibilHeaders(),
      'X-Action-Type': 'update_user',
    },
    body: JSON.stringify({id: userId, ...updateData}),
  });

  return response.json();
};

// Check existing
const checkExisting = async checkData => {
  const response = await fetch(
    'https://your-api.com/api/cibil-score/check-existing',
    {
      method: 'POST',
      headers: {
        ...getCibilHeaders(),
        'X-Action-Type': 'check_existing',
      },
      body: JSON.stringify(checkData),
    },
  );

  return response.json();
};

// Get users
const getUsers = async () => {
  const response = await fetch('https://your-api.com/api/cibil-score/get', {
    method: 'GET',
    headers: {
      ...getCibilHeaders(),
      'X-Action-Type': 'fetch_user',
    },
  });

  return response.json();
};
```

#### **Vanilla JavaScript Example:**

```javascript
// Without helper (manual headers)
fetch('https://your-api.com/api/cibil-score/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Browser': 'Chrome',
    'X-Device-Type': 'mobile',
    'X-Action-Type': 'create_user',
  },
  body: JSON.stringify(userData),
});

// With helper (automatic)
const headers = getCibilHeaders();
fetch('https://your-api.com/api/cibil-score/add', {
  method: 'POST',
  headers: {
    ...headers,
    'X-Action-Type': 'create_user',
  },
  body: JSON.stringify(userData),
});
```

#### **Axios Example:**

```javascript
import axios from 'axios';
import {getCibilHeaders} from './utils/cibilApiHeaders';

const api = axios.create({
  baseURL: 'https://your-api.com/api',
});

// Add interceptor
api.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    ...getCibilHeaders(),
  };
  return config;
});

// Use it
api.post('/cibil-score/add', userData, {
  headers: {'X-Action-Type': 'create_user'},
});
```

---

## 📋 Headers Reference

### **Automatically Detected:**

| Header                | What It Captures              |
| --------------------- | ----------------------------- |
| `X-Browser`           | Chrome, Safari, Firefox, Edge |
| `X-OS`                | Windows, MacOS, Android, iOS  |
| `X-Device-Type`       | mobile, tablet, desktop       |
| `X-Screen-Resolution` | 1920x1080, etc.               |
| `X-Timezone`          | Asia/Kolkata, etc.            |
| `X-Connection-Type`   | 4g, wifi, ethernet            |
| `X-Effective-Type`    | slow-2g, 2g, 3g, 4g           |
| `X-Downlink`          | Download speed (Mbps)         |
| `X-RTT`               | Network latency (ms)          |
| `X-Session-ID`        | Unique session ID             |

### **Manually Set:**

| Header          | Values                                                       | When to Use            |
| --------------- | ------------------------------------------------------------ | ---------------------- |
| `X-Action-Type` | `create_user`, `update_user`, `fetch_user`, `check_existing` | On each API call       |
| `X-Data-Source` | `web`, `mobile_app`, `api`                                   | Based on your app type |

---

## ✅ Complete Examples

### **Example 1: Create CIBIL User Form**

```javascript
import {getCibilHeaders} from './utils/cibilApiHeaders';

const CibilUserForm = () => {
  const handleSubmit = async formData => {
    try {
      const response = await fetch('https://your-api.com/api/cibil-score/add', {
        method: 'POST',
        headers: {
          ...getCibilHeaders(),
          'X-Action-Type': 'create_user',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          mobile_number: formData.mobile,
          IdentifierId: formData.pan,
          email: formData.email,
          clientKey: `KEY_${Date.now()}`,
          PartnerCustomerId: `PARTNER_${Date.now()}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.isExistingUser) {
          alert('User already exists!');
        } else {
          alert('User created successfully!');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form fields */}</form>;
};
```

### **Example 2: Update with CIBIL Score**

```javascript
import {getCibilHeaders} from './utils/cibilApiHeaders';

const updateCibilScore = async (userId, cibilData) => {
  try {
    const response = await fetch(
      'https://your-api.com/api/cibil-score/update',
      {
        method: 'PUT',
        headers: {
          ...getCibilHeaders(),
          'X-Action-Type': 'update_user',
        },
        body: JSON.stringify({
          id: userId,
          cibil_score: cibilData.score,
          population_rank: cibilData.rank,
          IVStatus: cibilData.ivStatus,
          bounces_last_3_months: cibilData.bounces3,
          bounces_last_6_months: cibilData.bounces6,
          inquiries_last_3_months: cibilData.inquiries3,
          total_liabilities: cibilData.totalLiabilities,
        }),
      },
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating CIBIL score:', error);
    throw error;
  }
};
```

---

## 🎯 Minimal Setup (If You're Busy)

**Just add this one header to your existing code:**

```javascript
// Before
fetch('/api/cibil-score/add', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(data),
});

// After (just add one header)
fetch('/api/cibil-score/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Action-Type': 'create_user', // 👈 Just this!
  },
  body: JSON.stringify(data),
});
```

---

## 📊 What You Get

### **Without Headers:**

- ✅ Request/response logged
- ✅ Response time
- ✅ Errors
- ✅ IP address

### **With Headers:**

- ✅ All above PLUS
- ✅ Browser & OS info
- ✅ Device type
- ✅ Network speed
- ✅ Session tracking
- ✅ Better debugging

---

## 🚀 Action Types Guide

Use these values for `X-Action-Type` header:

- `create_user` - When creating new CIBIL user
- `update_user` - When updating user data
- `fetch_user` - When getting user list/details
- `check_existing` - When checking if user exists
- `fetch_cibil_score` - When calling external CIBIL API
- `verify_identity` - When doing KYC/verification

---

## ✅ Summary

**Required from Frontend:** NOTHING! ✨

**Recommended from Frontend:**

1. Copy `cibilApiHeaders.js` helper (50 lines)
2. Use `getCibilHeaders()` in your fetch calls
3. Add `X-Action-Type` header

**That's it!** The backend does the rest automatically. 🎉
