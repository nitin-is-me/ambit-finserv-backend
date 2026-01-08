# CIBIL API Comprehensive Logging System

## Overview

This logging system captures detailed information about all CIBIL-related API calls, including request/response data, client information, network conditions, performance metrics, and error details.

## Components

### 1. **Model: `cibilApiLogModel.js`**

Stores comprehensive log data including:

#### Request Information

- Endpoint, HTTP method
- Request body, headers, params, query
- User identification (user_id, mobile_number, PAN)

#### Response Details

- Status code, response body
- Response time in milliseconds

#### Error Information

- Error occurred flag
- Error message and stack trace
- Error type classification

#### Client Information (from Frontend)

- IP address, user agent
- Browser, browser version
- Operating system
- Device type (mobile/tablet/desktop)
- Screen resolution
- Timezone and language

#### Network Information

- Connection type (4G, 5G, WiFi)
- Effective connection type
- Download speed (Mbps)
- Round trip time (ms)
- Data saver mode status

#### External API Calls

- Logs calls to CIBIL external API
- Request/response times
- Success/failure status
- Error messages

#### Performance Metrics

- Database query time
- Validation time
- Processing time
- Total request time

#### Business Context

- Action type (create_user, update_user, etc.)
- New vs existing user
- Data source (web, mobile_app)
- UTM parameters

---

### 2. **Middleware: `cibilApiLogger.js`**

Automatically logs all CIBIL API requests/responses.

**Features:**

- Intercepts all requests before processing
- Captures response data before sending to client
- Sanitizes sensitive data (passwords, OTP, tokens)
- Generates unique request IDs
- Measures response time
- Determines error types
- Saves logs asynchronously (doesn't slow down requests)

---

### 3. **Controllers: CIBIL Logs**

#### `getCibilLogs.js`

Get filtered logs with pagination.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)
- `error_only` - Show only errors (true/false)
- `mobile_number` - Filter by mobile number
- `IdentifierId` - Filter by PAN
- `user_id` - Filter by user ID
- `endpoint` - Filter by endpoint
- `method` - Filter by HTTP method
- `error_type` - Filter by error type
- `action_type` - Filter by action type
- `from_date` - Filter from date
- `to_date` - Filter to date
- `request_id` - Filter by request ID

#### `getCibilLogStats.js`

Get aggregated statistics and analytics.

**Returns:**

- Total requests, errors, success
- Average/max/min response times
- Error breakdown by type
- Endpoint statistics
- Hourly distribution
- Action type distribution
- Device type distribution
- Network type distribution
- Recent errors

---

### 4. **Utility: `externalApiLogger.js`**

Helper to log external API calls (like CIBIL API).

**Functions:**

- `logExternalApiCall()` - Log individual external API call
- `loggedAxiosCall()` - Axios wrapper with automatic logging

---

### 5. **Frontend Helper: `frontendLoggingHelper.js`**

JavaScript code for frontend to send enhanced data.

**Functions:**

- `getClientInfo()` - Browser, OS, device info
- `getNetworkInfo()` - Connection type, speed, RTT
- `createEnhancedHeaders()` - Add logging headers
- `fetchWithLogging()` - Enhanced fetch with logging
- `fetchWithRetry()` - Fetch with retry logic

---

## Setup Instructions

### Backend Setup

1. **Add route to main routes file** (`routes/index.js`):

```javascript
const cibilLogsRoute = require('./cibilLogsRoute');

app.use('/api/cibil-logs', cibilLogsRoute);
```

2. **Middleware is already applied** to CIBIL routes in `routes/cibileScoreRoute.js`

3. **For external CIBIL API calls**, use the external API logger:

```javascript
const {loggedAxiosCall} = require('../utils/externalApiLogger');

// Example in your controller
const callCibilApi = async (req, res) => {
  try {
    const response = await loggedAxiosCall(req, {
      apiName: 'CIBIL Score API',
      url: 'https://cibil-api.com/score',
      method: 'POST',
      data: {
        pan: req.body.IdentifierId,
        mobile: req.body.mobile_number,
      },
      headers: {
        Authorization: 'Bearer TOKEN',
      },
    });

    // Process response
  } catch (error) {
    // Handle error
  }
};
```

---

### Frontend Setup

1. **Copy code from `frontendLoggingHelper.js`** to your frontend

2. **Use enhanced fetch for CIBIL API calls**:

```javascript
import {fetchWithLogging, fetchWithRetry} from './utils/frontendLoggingHelper';

// Example: Create CIBIL User
const createUser = async userData => {
  try {
    const response = await fetchWithLogging(
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
    console.error('Failed to create user:', error);
    throw error;
  }
};

// Example: With retry logic
const updateUserWithRetry = async updateData => {
  try {
    const response = await fetchWithRetry(
      'https://your-api.com/api/cibil-score/update',
      {
        method: 'PUT',
        body: JSON.stringify(updateData),
      },
      'update_user', // Action type
      3, // Max retries
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to update user after retries:', error);
    throw error;
  }
};
```

3. **Headers sent automatically**:

- X-Browser, X-Browser-Version
- X-OS, X-Device-Type
- X-Screen-Resolution, X-Timezone
- X-Connection-Type, X-Effective-Type
- X-Downlink, X-RTT, X-Save-Data
- X-Session-ID, X-Request-ID
- X-Action-Type, X-Data-Source
- X-Is-Retry, X-Retry-Count (for retries)

---

## API Endpoints

### 1. **Get CIBIL Logs**

```bash
GET /api/cibil-logs/logs?page=1&limit=50&error_only=true
```

**Response:**

```json
{
  "success": true,
  "message": "CIBIL API logs fetched successfully",
  "data": [
    {
      "_id": "...",
      "endpoint": "/api/cibil-score/add",
      "method": "POST",
      "response_status": 201,
      "response_time_ms": 245,
      "error_occurred": false,
      "mobile_number": "9876543210",
      "client_info": {
        "browser": "Chrome",
        "device_type": "mobile",
        "os": "Android"
      },
      "network_info": {
        "connection_type": "4g",
        "effective_type": "4g"
      },
      "createdAt": "2023-10-09T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total_entries": 150,
    "total_pages": 3,
    "current_page": 1,
    "page_size": 50
  }
}
```

### 2. **Get CIBIL Statistics**

```bash
GET /api/cibil-logs/stats?from_date=2023-10-01&to_date=2023-10-09
```

**Response:**

```json
{
  "success": true,
  "message": "CIBIL API statistics fetched successfully",
  "data": {
    "overview": {
      "total_requests": 1250,
      "total_errors": 45,
      "total_success": 1205,
      "avg_response_time": 230.5,
      "max_response_time": 2500,
      "min_response_time": 45,
      "total_timeouts": 3,
      "total_retries": 12
    },
    "error_breakdown": [
      { "_id": "validation_error", "count": 20 },
      { "_id": "network_error", "count": 15 },
      { "_id": "timeout_error", "count": 10 }
    ],
    "endpoint_stats": [...],
    "hourly_distribution": [...],
    "action_type_distribution": [...],
    "device_type_distribution": [...],
    "network_type_distribution": [...],
    "recent_errors": [...]
  }
}
```

---

## What Gets Logged

### ✅ **Always Logged**

- Request endpoint, method
- Request/response body
- Response status code
- Response time
- Client IP, user agent
- Timestamp

### ✅ **When Available (from Frontend)**

- Browser name and version
- Operating system
- Device type
- Screen resolution
- Timezone, language
- Network connection type
- Network speed
- Round trip time
- Session ID

### ✅ **For Errors**

- Error message
- Error stack trace
- Error type classification
- Whether it's a timeout
- Whether it's rate limited

### ✅ **For External API Calls**

- API name (e.g., "CIBIL API")
- Request/response times
- Duration
- Success/failure
- Request/response payloads

### ✅ **Business Context**

- Action type (create_user, update_user, etc.)
- Is new user vs existing user
- Data source (web, mobile_app)
- UTM parameters

### ✅ **Performance Metrics**

- Database query time
- Validation time
- Processing time
- Total request time

---

## Error Types Classification

1. **validation_error** - Invalid input data
2. **database_error** - MongoDB errors
3. **network_error** - Network connectivity issues
4. **timeout_error** - Request timeout
5. **authentication_error** - Auth failures
6. **authorization_error** - Permission denied
7. **external_api_error** - CIBIL API failures
8. **unknown_error** - Unclassified errors

---

## Use Cases

### 1. **Debug Failed Requests**

```bash
GET /api/cibil-logs/logs?error_only=true&mobile_number=9876543210
```

Find all failed requests for a specific user.

### 2. **Performance Analysis**

```bash
GET /api/cibil-logs/stats?from_date=2023-10-01
```

Analyze response times, error rates, peak hours.

### 3. **Network Issues**

Filter logs by network type to identify issues with specific connections.

### 4. **Device-Specific Problems**

Filter by device type to find mobile vs desktop issues.

### 5. **Track User Journey**

Use `session_id` or `request_id` to track user's complete journey.

### 6. **Monitor External APIs**

Check `external_api_calls` array to monitor CIBIL API health.

---

## Best Practices

### Frontend

1. Always use `fetchWithLogging` or `fetchWithRetry`
2. Set appropriate action types
3. Handle errors gracefully
4. Implement retry logic for critical operations

### Backend

1. Use `loggedAxiosCall` for external APIs
2. Don't log sensitive data (auto-sanitized)
3. Monitor logs regularly
4. Set up alerts for high error rates

### Monitoring

1. Check statistics daily
2. Monitor error breakdown
3. Track response time trends
4. Investigate network-related failures
5. Analyze device-specific issues

---

## Database Indexes

For optimal performance, these indexes are created:

- `createdAt` (descending) - Time-based queries
- `user_id` - User-specific logs
- `mobile_number` - Mobile-based searches
- `IdentifierId` - PAN-based searches
- `error_occurred` - Error filtering
- `endpoint + method` - Endpoint statistics
- `request_id` - Request tracking
- `business_context.action_type` - Action analysis

---

## Security

- **Sensitive data** (passwords, OTP, tokens) automatically redacted
- **Authorization headers** sanitized in logs
- **Response data** sanitized before logging
- **Stack traces** only in development mode
- **PII data** can be excluded if needed

---

## Next Steps

1. ✅ Model created
2. ✅ Middleware created and applied
3. ✅ Controllers created
4. ✅ Routes created
5. ⏳ Add route to main app
6. ⏳ Implement frontend helper
7. ⏳ Set up monitoring dashboard
8. ⏳ Configure alerts
