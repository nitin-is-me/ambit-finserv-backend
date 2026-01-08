# CIBIL Logging - Complete Data Capture List

## 📊 All Data Points Captured

### 🌐 **Request Information**

| Field             | Type   | Source           | Description                            |
| ----------------- | ------ | ---------------- | -------------------------------------- |
| `endpoint`        | String | Backend          | API endpoint URL                       |
| `method`          | String | Backend          | HTTP method (GET/POST/PUT/DELETE)      |
| `request_body`    | Object | Backend          | Complete request payload (sanitized)   |
| `request_headers` | Object | Backend          | HTTP headers (sensitive data redacted) |
| `request_params`  | Object | Backend          | URL parameters                         |
| `request_query`   | Object | Backend          | Query string parameters                |
| `request_id`      | String | Backend/Frontend | Unique ID for request tracking         |

---

### 👤 **User Identification**

| Field           | Type     | Source  | Description          |
| --------------- | -------- | ------- | -------------------- |
| `user_id`       | ObjectId | Backend | MongoDB user ID      |
| `mobile_number` | String   | Backend | User's mobile number |
| `IdentifierId`  | String   | Backend | PAN number           |

---

### 📤 **Response Details**

| Field              | Type   | Source  | Description                   |
| ------------------ | ------ | ------- | ----------------------------- |
| `response_status`  | Number | Backend | HTTP status code              |
| `response_body`    | Object | Backend | Complete response (sanitized) |
| `response_time_ms` | Number | Backend | Total request duration in ms  |

---

### ❌ **Error Information**

| Field            | Type    | Source  | Description             |
| ---------------- | ------- | ------- | ----------------------- |
| `error_occurred` | Boolean | Backend | Whether error happened  |
| `error_message`  | String  | Backend | Error message           |
| `error_stack`    | String  | Backend | Stack trace (dev only)  |
| `error_type`     | Enum    | Backend | Classification of error |

**Error Types:**

- `validation_error`
- `database_error`
- `network_error`
- `timeout_error`
- `authentication_error`
- `authorization_error`
- `external_api_error`
- `unknown_error`

---

### 💻 **Client Information (Frontend)**

| Field                           | Type   | Source   | Description                                     |
| ------------------------------- | ------ | -------- | ----------------------------------------------- |
| `client_info.ip_address`        | String | Backend  | Client IP address                               |
| `client_info.user_agent`        | String | Backend  | Full user agent string                          |
| `client_info.browser`           | String | Frontend | Browser name (Chrome, Safari, etc.)             |
| `client_info.browser_version`   | String | Frontend | Browser version number                          |
| `client_info.os`                | String | Frontend | Operating system (Windows, MacOS, Android, iOS) |
| `client_info.device_type`       | String | Frontend | Device type (mobile, tablet, desktop)           |
| `client_info.screen_resolution` | String | Frontend | Screen size (e.g., "1920x1080")                 |
| `client_info.timezone`          | String | Frontend | User's timezone                                 |
| `client_info.language`          | String | Backend  | Preferred language                              |

---

### 📡 **Network Information (Frontend)**

| Field                          | Type    | Source   | Description                              |
| ------------------------------ | ------- | -------- | ---------------------------------------- |
| `network_info.connection_type` | String  | Frontend | Connection type (4g, 5g, wifi, ethernet) |
| `network_info.effective_type`  | String  | Frontend | Effective type (slow-2g, 2g, 3g, 4g)     |
| `network_info.downlink`        | Number  | Frontend | Download speed in Mbps                   |
| `network_info.rtt`             | Number  | Frontend | Round trip time in ms                    |
| `network_info.save_data`       | Boolean | Frontend | Data saver mode enabled                  |

**Why This Matters:**

- Identify slow network issues
- Optimize for 2G/3G users
- Detect data saver mode users

---

### 🔌 **External API Calls** (e.g., CIBIL API)

| Field                                   | Type    | Source  | Description                        |
| --------------------------------------- | ------- | ------- | ---------------------------------- |
| `external_api_calls[].api_name`         | String  | Backend | API name (e.g., "CIBIL Score API") |
| `external_api_calls[].endpoint`         | String  | Backend | External API endpoint              |
| `external_api_calls[].method`           | String  | Backend | HTTP method                        |
| `external_api_calls[].request_time`     | Date    | Backend | When request started               |
| `external_api_calls[].response_time`    | Date    | Backend | When response received             |
| `external_api_calls[].duration_ms`      | Number  | Backend | API call duration                  |
| `external_api_calls[].status_code`      | Number  | Backend | Response status                    |
| `external_api_calls[].success`          | Boolean | Backend | Success/failure flag               |
| `external_api_calls[].error_message`    | String  | Backend | Error if failed                    |
| `external_api_calls[].request_payload`  | Object  | Backend | Request data (sanitized)           |
| `external_api_calls[].response_payload` | Object  | Backend | Response data (sanitized)          |

**Why This Matters:**

- Monitor CIBIL API health
- Track external API failures
- Measure dependency performance
- Debug integration issues

---

### ⚡ **Performance Metrics**

| Field                             | Type   | Source  | Description                |
| --------------------------------- | ------ | ------- | -------------------------- |
| `performance.database_query_time` | Number | Backend | DB query duration (ms)     |
| `performance.validation_time`     | Number | Backend | Input validation time (ms) |
| `performance.processing_time`     | Number | Backend | Business logic time (ms)   |
| `performance.total_time`          | Number | Backend | Complete request time (ms) |

**Why This Matters:**

- Identify slow database queries
- Optimize validation logic
- Find performance bottlenecks
- Track API SLA compliance

---

### 📊 **Business Context**

| Field                               | Type    | Source           | Description                   |
| ----------------------------------- | ------- | ---------------- | ----------------------------- |
| `business_context.action_type`      | Enum    | Frontend/Backend | Type of operation             |
| `business_context.is_new_user`      | Boolean | Backend          | Whether user is new           |
| `business_context.is_existing_user` | Boolean | Backend          | Whether user exists           |
| `business_context.data_source`      | String  | Frontend         | Source (web, mobile_app, api) |
| `business_context.utm_source`       | String  | Frontend         | UTM source parameter          |
| `business_context.utm_medium`       | String  | Frontend         | UTM medium parameter          |
| `business_context.utm_campaign`     | String  | Frontend         | UTM campaign parameter        |

**Action Types:**

- `create_user`
- `update_user`
- `fetch_user`
- `check_existing`
- `fetch_cibil_score`
- `verify_identity`

**Why This Matters:**

- Track user acquisition sources
- Measure conversion funnels
- A/B testing analysis
- Campaign performance

---

### 🔄 **Session & Tracking**

| Field        | Type   | Source           | Description               |
| ------------ | ------ | ---------------- | ------------------------- |
| `session_id` | String | Frontend         | User session ID           |
| `request_id` | String | Frontend/Backend | Unique request identifier |

**Why This Matters:**

- Track complete user journey
- Link related requests
- Debug multi-step processes
- Session replay capability

---

### 🌍 **Environment & Server**

| Field                      | Type   | Source  | Description                          |
| -------------------------- | ------ | ------- | ------------------------------------ |
| `environment`              | Enum   | Backend | Environment (dev/staging/production) |
| `server_info.hostname`     | String | Backend | Server hostname                      |
| `server_info.node_version` | String | Backend | Node.js version                      |
| `server_info.server_time`  | Date   | Backend | Server timestamp                     |

---

### 🔁 **Retry & Rate Limiting**

| Field             | Type    | Source   | Description             |
| ----------------- | ------- | -------- | ----------------------- |
| `is_retry`        | Boolean | Frontend | Is this a retry attempt |
| `retry_count`     | Number  | Frontend | Number of retries       |
| `is_timeout`      | Boolean | Backend  | Request timed out       |
| `is_rate_limited` | Boolean | Backend  | Hit rate limit          |

**Why This Matters:**

- Track retry patterns
- Identify persistent failures
- Monitor rate limiting
- Optimize retry strategies

---

### 📅 **Timestamps**

| Field       | Type | Source  | Description          |
| ----------- | ---- | ------- | -------------------- |
| `createdAt` | Date | Backend | When log was created |
| `updatedAt` | Date | Backend | When log was updated |

---

## 🎯 Use Case Examples

### 1. **Debug Slow Requests**

```javascript
{
  response_time_ms: 2500,
  performance: {
    database_query_time: 2100, // ← Problem!
    validation_time: 50,
    processing_time: 350
  }
}
```

**Finding:** Database query is slow, needs optimization.

---

### 2. **Identify Network Issues**

```javascript
{
  error_occurred: true,
  error_type: "timeout_error",
  network_info: {
    connection_type: "2g", // ← Slow connection
    effective_type: "slow-2g",
    rtt: 2500 // ← High latency
  }
}
```

**Finding:** User on slow 2G network, implement better error handling.

---

### 3. **Track External API Failures**

```javascript
{
  external_api_calls: [
    {
      api_name: 'CIBIL Score API',
      success: false,
      error_message: 'Connection timeout',
      duration_ms: 30000, // ← CIBIL API down
    },
  ];
}
```

**Finding:** CIBIL API is timing out, implement retry logic.

---

### 4. **Analyze User Journey**

```javascript
{
  session_id: "session_123456",
  business_context: {
    action_type: "create_user",
    utm_source: "google",
    utm_campaign: "cibil_score_offer"
  }
}
```

**Finding:** Track which campaigns bring users to CIBIL score.

---

### 5. **Device-Specific Issues**

```javascript
{
  error_occurred: true,
  client_info: {
    device_type: "mobile",
    os: "iOS",
    browser: "Safari"
  }
}
```

**Finding:** iOS Safari users experiencing issues, investigate.

---

## 📈 Analytics Capabilities

### **Available Metrics**

- ✅ Total requests per hour/day/week
- ✅ Error rate percentage
- ✅ Average response time
- ✅ Success vs failure ratio
- ✅ Most common errors
- ✅ Slowest endpoints
- ✅ Device type distribution
- ✅ Network type distribution
- ✅ Browser distribution
- ✅ Geographic distribution (via timezone)
- ✅ Peak usage hours
- ✅ Retry patterns
- ✅ External API health
- ✅ Campaign performance
- ✅ New vs returning users

---

## 🔒 Data Privacy & Security

### **Automatically Redacted:**

- ❌ Passwords
- ❌ OTP codes
- ❌ CVV/PIN
- ❌ Secret keys
- ❌ API tokens
- ❌ Authorization headers
- ❌ Cookies

### **Stored:**

- ✅ User identification (for debugging)
- ✅ Request/response structure
- ✅ Error details
- ✅ Performance metrics
- ✅ Client/network information

---

## 💡 Benefits

1. **Root Cause Analysis** - Understand why requests fail
2. **Performance Optimization** - Identify bottlenecks
3. **User Experience** - Track issues by device/network
4. **External Dependencies** - Monitor CIBIL API health
5. **Business Intelligence** - Campaign and conversion tracking
6. **Compliance** - Audit trail for CIBIL transactions
7. **Proactive Monitoring** - Catch issues before users report
8. **Data-Driven Decisions** - Analytics for improvements

---

## 🚀 Next Level: What Else Can Be Added

### Future Enhancements:

1. **Geographic Location** (via IP)
2. **ISP Information**
3. **Page Load Times** (frontend)
4. **Memory Usage** (backend)
5. **CPU Usage** (backend)
6. **Database Pool Stats**
7. **Cache Hit/Miss Rates**
8. **Webhook Events**
9. **User Actions Timeline**
10. **A/B Test Variants**

Would you like any of these additions?
