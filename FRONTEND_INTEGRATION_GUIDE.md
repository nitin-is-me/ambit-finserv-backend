# Frontend Integration Guide for CIBIL Logging

## 🚀 Quick Start

The logging system works automatically on the backend, but you can send **optional headers** from frontend to capture richer data like device info, network speed, browser details, etc.

---

## 📋 What to Send from Frontend

### **Option 1: Minimal (No Changes Required)**

If you don't send any special headers, the backend will still log:

- ✅ Request/response data
- ✅ IP address
- ✅ Basic user agent
- ✅ Response time
- ✅ Errors

**You can use the API as-is without any frontend changes!**

---

### **Option 2: Enhanced (Recommended)**

Send custom headers to capture rich insights:

#### **Headers to Send:**

| Header Name           | Type   | Example          | Description           |
| --------------------- | ------ | ---------------- | --------------------- |
| `X-Browser`           | string | `"Chrome"`       | Browser name          |
| `X-Browser-Version`   | string | `"118"`          | Browser version       |
| `X-OS`                | string | `"Windows"`      | Operating system      |
| `X-Device-Type`       | string | `"mobile"`       | Device type           |
| `X-Screen-Resolution` | string | `"1920x1080"`    | Screen size           |
| `X-Timezone`          | string | `"Asia/Kolkata"` | User timezone         |
| `X-Connection-Type`   | string | `"4g"`           | Network type          |
| `X-Effective-Type`    | string | `"4g"`           | Effective connection  |
| `X-Downlink`          | string | `"10"`           | Download speed (Mbps) |
| `X-RTT`               | string | `"50"`           | Round trip time (ms)  |
| `X-Save-Data`         | string | `"false"`        | Data saver mode       |
| `X-Session-ID`        | string | `"session_123"`  | Session identifier    |
| `X-Action-Type`       | string | `"create_user"`  | Business action       |
| `X-Data-Source`       | string | `"web"`          | Data source           |

---

## 💻 Frontend Implementation

### **Step 1: Create Helper File**

Create `src/utils/apiLogger.js`:

```javascript
/**
 * Get browser information
 */
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let version = 'Unknown';

  if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
    browser = 'Chrome';
    version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
  } else if (
    userAgent.indexOf('Safari') > -1 &&
    userAgent.indexOf('Chrome') === -1
  ) {
    browser = 'Safari';
    version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browser = 'Firefox';
    version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Edg') > -1) {
    browser = 'Edge';
    version = userAgent.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
  }

  return {browser, version};
};

/**
 * Get operating system
 */
const getOS = () => {
  const userAgent = navigator.userAgent;

  if (userAgent.indexOf('Windows') > -1) return 'Windows';
  if (userAgent.indexOf('Mac') > -1) return 'MacOS';
  if (userAgent.indexOf('Linux') > -1) return 'Linux';
  if (userAgent.indexOf('Android') > -1) return 'Android';
  if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1)
    return 'iOS';

  return 'Unknown';
};

/**
 * Get device type
 */
const getDeviceType = () => {
  const userAgent = navigator.userAgent;

  if (/Mobile|Android|iPhone/i.test(userAgent)) return 'mobile';
  if (/iPad|Tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
};

/**
 * Get network information
 */
const getNetworkInfo = () => {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) {
    return {
      connectionType: 'unknown',
      effectiveType: 'unknown',
      downlink: '0',
      rtt: '0',
      saveData: 'false',
    };
  }

  return {
    connectionType: connection.type || 'unknown',
    effectiveType: connection.effectiveType || 'unknown',
    downlink: (connection.downlink || 0).toString(),
    rtt: (connection.rtt || 0).toString(),
    saveData: (connection.saveData || false).toString(),
  };
};

/**
 * Get or create session ID
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('cibil_session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('cibil_session_id', sessionId);
  }

  return sessionId;
};

/**
 * Create enhanced headers for API calls
 */
export const createApiHeaders = (actionType = '', additionalHeaders = {}) => {
  const browserInfo = getBrowserInfo();
  const networkInfo = getNetworkInfo();

  return {
    'Content-Type': 'application/json',

    // Client Information
    'X-Browser': browserInfo.browser,
    'X-Browser-Version': browserInfo.version,
    'X-OS': getOS(),
    'X-Device-Type': getDeviceType(),
    'X-Screen-Resolution': `${window.screen.width}x${window.screen.height}`,
    'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,

    // Network Information
    'X-Connection-Type': networkInfo.connectionType,
    'X-Effective-Type': networkInfo.effectiveType,
    'X-Downlink': networkInfo.downlink,
    'X-RTT': networkInfo.rtt,
    'X-Save-Data': networkInfo.saveData,

    // Session & Tracking
    'X-Session-ID': getSessionId(),
    'X-Action-Type': actionType,
    'X-Data-Source': 'web', // or 'mobile_app'

    // Merge any additional headers
    ...additionalHeaders,
  };
};

/**
 * Enhanced fetch wrapper
 */
export const apiFetch = async (url, options = {}, actionType = '') => {
  const enhancedOptions = {
    ...options,
    headers: {
      ...createApiHeaders(actionType),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, enhancedOptions);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default {
  createApiHeaders,
  apiFetch,
};
```

---

### **Step 2: Use in Your API Calls**

#### **Example 1: Create CIBIL User**

```javascript
import {apiFetch} from './utils/apiLogger';

const createCibilUser = async userData => {
  try {
    const response = await apiFetch(
      'https://your-api.com/api/cibil-score/add',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      'create_user', // Action type
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create CIBIL user:', error);
    throw error;
  }
};
```

#### **Example 2: Update CIBIL User**

```javascript
import {apiFetch} from './utils/apiLogger';

const updateCibilUser = async (userId, updateData) => {
  try {
    const response = await apiFetch(
      'https://your-api.com/api/cibil-score/update',
      {
        method: 'PUT',
        body: JSON.stringify({
          id: userId,
          ...updateData,
        }),
      },
      'update_user', // Action type
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to update CIBIL user:', error);
    throw error;
  }
};
```

#### **Example 3: Check Existing User**

```javascript
import {apiFetch} from './utils/apiLogger';

const checkExistingUser = async checkData => {
  try {
    const response = await apiFetch(
      'https://your-api.com/api/cibil-score/check-existing',
      {
        method: 'POST',
        body: JSON.stringify(checkData),
      },
      'check_existing', // Action type
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to check user:', error);
    throw error;
  }
};
```

#### **Example 4: Get All Users**

```javascript
import {apiFetch} from './utils/apiLogger';

const getAllUsers = async (includeLogs = false) => {
  try {
    const url = includeLogs
      ? 'https://your-api.com/api/cibil-score/get?include_logs=true'
      : 'https://your-api.com/api/cibil-score/get';

    const response = await apiFetch(
      url,
      {
        method: 'GET',
      },
      'fetch_user', // Action type
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get users:', error);
    throw error;
  }
};
```

---

### **Step 3: Using with React**

#### **React Hook Example**

```javascript
import {useState} from 'react';
import {apiFetch} from '../utils/apiLogger';

export const useCibilApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async userData => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch(
        '/api/cibil-score/add',
        {
          method: 'POST',
          body: JSON.stringify(userData),
        },
        'create_user',
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch(
        '/api/cibil-score/update',
        {
          method: 'PUT',
          body: JSON.stringify({id: userId, ...updateData}),
        },
        'update_user',
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createUser,
    updateUser,
  };
};
```

#### **React Component Example**

```javascript
import React, {useState} from 'react';
import {useCibilApi} from '../hooks/useCibilApi';

const CibilUserForm = () => {
  const {loading, error, createUser} = useCibilApi();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    IdentifierId: '',
  });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const result = await createUser(formData);

      if (result.success) {
        alert('User created successfully!');
      }
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input
        type="text"
        value={formData.first_name}
        onChange={e => setFormData({...formData, first_name: e.target.value})}
        placeholder="First Name"
      />
      {/* More fields... */}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};
```

---

### **Step 4: Using with Axios**

```javascript
import axios from 'axios';
import {createApiHeaders} from './utils/apiLogger';

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: 'https://your-api.com/api',
});

// Add request interceptor to include headers
apiClient.interceptors.request.use(
  config => {
    // Get action type from config or default
    const actionType = config.actionType || '';

    // Merge enhanced headers
    config.headers = {
      ...createApiHeaders(actionType),
      ...config.headers,
    };

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Usage
const createCibilUser = async userData => {
  try {
    const response = await apiClient.post('/cibil-score/add', userData, {
      actionType: 'create_user', // Custom property
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

---

## 📊 Action Types Reference

Use these action types for better tracking:

| Action Type         | When to Use             | Example                    |
| ------------------- | ----------------------- | -------------------------- |
| `create_user`       | Creating new CIBIL user | Add new user form          |
| `update_user`       | Updating user details   | Edit user, add CIBIL score |
| `fetch_user`        | Getting user data       | View user list, details    |
| `check_existing`    | Checking if user exists | Duplicate check            |
| `fetch_cibil_score` | Getting CIBIL score     | External API call          |
| `verify_identity`   | Identity verification   | KYC process                |

---

## 🎯 Complete Example: CIBIL User Flow

```javascript
import {apiFetch} from './utils/apiLogger';

// Step 1: Check if user exists
const checkUser = async (mobile, pan) => {
  const response = await apiFetch(
    '/api/cibil-score/check-existing',
    {
      method: 'POST',
      body: JSON.stringify({
        mobile_number: mobile,
        IdentifierId: pan,
        first_name: 'John',
        last_name: 'Doe',
      }),
    },
    'check_existing',
  );
  return response.json();
};

// Step 2: Create user if doesn't exist
const createUser = async userData => {
  const response = await apiFetch(
    '/api/cibil-score/add',
    {
      method: 'POST',
      body: JSON.stringify(userData),
    },
    'create_user',
  );
  return response.json();
};

// Step 3: Update with CIBIL score
const updateWithScore = async (userId, scoreData) => {
  const response = await apiFetch(
    '/api/cibil-score/update',
    {
      method: 'PUT',
      body: JSON.stringify({
        id: userId,
        ...scoreData,
      }),
    },
    'update_user',
  );
  return response.json();
};

// Complete flow
const processCibilUser = async userData => {
  try {
    // Check existing
    const existingCheck = await checkUser(
      userData.mobile_number,
      userData.IdentifierId,
    );

    let userId;

    if (existingCheck.userExists) {
      console.log('User exists:', existingCheck.data);
      userId = existingCheck.data.id;
    } else {
      // Create new user
      const createResult = await createUser(userData);
      userId = createResult.data.id;
    }

    // Update with CIBIL score (from external API)
    const updateResult = await updateWithScore(userId, {
      cibil_score: 750,
      population_rank: 85,
      IVStatus: 'Verified',
    });

    return updateResult;
  } catch (error) {
    console.error('Flow error:', error);
    throw error;
  }
};
```

---

## ✅ What Gets Logged

### **Without Frontend Headers:**

- ✅ Endpoint, method, status
- ✅ Request/response body
- ✅ IP address
- ✅ Basic user agent
- ✅ Response time
- ✅ Errors

### **With Frontend Headers:**

- ✅ All of the above, PLUS:
- ✅ Browser name & version
- ✅ Operating system
- ✅ Device type (mobile/tablet/desktop)
- ✅ Screen resolution
- ✅ Network speed & type
- ✅ Connection quality
- ✅ Session tracking
- ✅ Action type
- ✅ User timezone

---

## 🚀 Quick Integration Checklist

- [ ] Copy `apiLogger.js` to your project
- [ ] Replace `fetch()` calls with `apiFetch()`
- [ ] Add action types to each API call
- [ ] Test in browser console (check Network tab headers)
- [ ] Verify logs in backend API

---

## 🔍 Testing

### **Check Headers in Browser:**

```javascript
// Open browser console and run:
import {createApiHeaders} from './utils/apiLogger';

console.log(createApiHeaders('test_action'));

// You should see all headers logged
```

### **Verify Backend Receives Headers:**

Check the backend logs or database - you should see:

- `client_info` populated with browser, OS, device
- `network_info` populated with connection details
- `business_context.action_type` set to your action type

---

## 📝 Summary

### **Minimum Required (Works without changes):**

```javascript
// Regular fetch - backend still logs basic info
fetch('/api/cibil-score/add', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(userData),
});
```

### **Recommended (Rich logging):**

```javascript
// Enhanced fetch - backend logs everything
apiFetch(
  '/api/cibil-score/add',
  {
    method: 'POST',
    body: JSON.stringify(userData),
  },
  'create_user',
);
```

**The logging system works out of the box! Enhanced headers are optional but highly recommended for better insights.** 🎯
