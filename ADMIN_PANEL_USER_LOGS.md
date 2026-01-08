# CIBIL User-Wise Logs - Admin Panel Component

## 📊 New Endpoint: Get Logs Per CIBIL User

### **Endpoint**

```
GET /api/cibil-logs/user-logs
```

### **Query Parameters**

- `user_id` - MongoDB User ID (optional)
- `mobile_number` - Mobile number (optional)
- `IdentifierId` - PAN number (optional)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)

**Note:** At least one identifier (user_id, mobile_number, or IdentifierId) is required.

---

## 🔍 API Usage Examples

### **By User ID**

```bash
curl "https://your-api.com/api/cibil-logs/user-logs?user_id=64f8a1b2c3d4e5f6a7b8c9d0"
```

### **By Mobile Number**

```bash
curl "https://your-api.com/api/cibil-logs/user-logs?mobile_number=9876543210"
```

### **By PAN Number**

```bash
curl "https://your-api.com/api/cibil-logs/user-logs?IdentifierId=ABCDE1234F"
```

### **With Pagination**

```bash
curl "https://your-api.com/api/cibil-logs/user-logs?mobile_number=9876543210&page=1&limit=25"
```

---

## 📄 Response Format

```json
{
  "success": true,
  "message": "User-specific CIBIL logs fetched successfully",
  "user_identifier": {
    "user_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "mobile_number": "9876543210",
    "IdentifierId": "ABCDE1234F"
  },
  "statistics": {
    "total_requests": 45,
    "total_errors": 3,
    "total_success": 42,
    "avg_response_time": 245.5,
    "max_response_time": 1200,
    "min_response_time": 89,
    "first_request": "2023-10-01T10:30:00.000Z",
    "last_request": "2023-10-09T15:45:00.000Z"
  },
  "action_timeline": [
    {
      "_id": "create_user",
      "count": 1,
      "last_occurred": "2023-10-01T10:30:00.000Z"
    },
    {
      "_id": "update_user",
      "count": 20,
      "last_occurred": "2023-10-09T15:45:00.000Z"
    },
    {
      "_id": "fetch_user",
      "count": 24,
      "last_occurred": "2023-10-09T15:40:00.000Z"
    }
  ],
  "error_breakdown": [
    {
      "_id": "validation_error",
      "count": 2,
      "last_error": "2023-10-05T12:00:00.000Z",
      "error_messages": ["Invalid PAN format", "Missing required field"]
    },
    {
      "_id": "network_error",
      "count": 1,
      "last_error": "2023-10-03T09:15:00.000Z",
      "error_messages": ["Connection timeout"]
    }
  ],
  "device_info": [
    {
      "_id": {
        "device_type": "mobile",
        "browser": "Chrome",
        "os": "Android"
      },
      "count": 30
    },
    {
      "_id": {
        "device_type": "desktop",
        "browser": "Chrome",
        "os": "Windows"
      },
      "count": 15
    }
  ],
  "external_api_calls": [
    {
      "_id": "...",
      "endpoint": "/api/cibil-score/update",
      "createdAt": "2023-10-09T15:45:00.000Z",
      "external_api_calls": [
        {
          "api_name": "CIBIL Score API",
          "endpoint": "https://cibil-api.com/score",
          "method": "POST",
          "duration_ms": 1250,
          "status_code": 200,
          "success": true
        }
      ]
    }
  ],
  "logs": [
    // All logs for this user (paginated)
  ],
  "pagination": {
    "total_entries": 45,
    "total_pages": 2,
    "current_page": 1,
    "page_size": 25
  }
}
```

---

## 🎨 React Admin Panel Component

### **CibilUserLogs.jsx**

```jsx
import React, {useState, useEffect} from 'react';
import './CibilUserLogs.css';

const CibilUserLogs = () => {
  const [searchType, setSearchType] = useState('mobile_number');
  const [searchValue, setSearchValue] = useState('');
  const [userLogs, setUserLogs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const searchUser = async () => {
    if (!searchValue) {
      alert('Please enter a search value');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://your-api.com/api/cibil-logs/user-logs?${searchType}=${searchValue}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setUserLogs(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch user logs:', error);
      alert('Failed to fetch user logs');
    } finally {
      setLoading(false);
    }
  };

  const viewLogDetails = log => {
    setSelectedLog(log);
  };

  return (
    <div className="cibil-user-logs">
      <h1>CIBIL User Activity Logs</h1>

      {/* Search Section */}
      <div className="search-section">
        <h3>Search User</h3>
        <div className="search-controls">
          <select
            value={searchType}
            onChange={e => setSearchType(e.target.value)}>
            <option value="mobile_number">Mobile Number</option>
            <option value="user_id">User ID</option>
            <option value="IdentifierId">PAN Number</option>
          </select>
          <input
            type="text"
            placeholder={`Enter ${searchType.replace('_', ' ')}`}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && searchUser()}
          />
          <button onClick={searchUser} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* User Statistics */}
      {userLogs && (
        <>
          <div className="user-info">
            <h3>User Information</h3>
            <div className="info-grid">
              {userLogs.user_identifier.user_id && (
                <div>
                  <strong>User ID:</strong> {userLogs.user_identifier.user_id}
                </div>
              )}
              {userLogs.user_identifier.mobile_number && (
                <div>
                  <strong>Mobile:</strong>{' '}
                  {userLogs.user_identifier.mobile_number}
                </div>
              )}
              {userLogs.user_identifier.IdentifierId && (
                <div>
                  <strong>PAN:</strong> {userLogs.user_identifier.IdentifierId}
                </div>
              )}
            </div>
          </div>

          <div className="user-stats">
            <h3>Activity Statistics</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-value">
                  {userLogs.statistics.total_requests}
                </div>
                <div className="stat-label">Total Requests</div>
              </div>
              <div className="stat-box success">
                <div className="stat-value">
                  {userLogs.statistics.total_success}
                </div>
                <div className="stat-label">Successful</div>
              </div>
              <div className="stat-box error">
                <div className="stat-value">
                  {userLogs.statistics.total_errors}
                </div>
                <div className="stat-label">Errors</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">
                  {userLogs.statistics.avg_response_time?.toFixed(0)} ms
                </div>
                <div className="stat-label">Avg Response Time</div>
              </div>
            </div>

            <div className="time-range">
              <p>
                <strong>First Activity:</strong>{' '}
                {userLogs.statistics.first_request
                  ? new Date(userLogs.statistics.first_request).toLocaleString()
                  : 'N/A'}
              </p>
              <p>
                <strong>Last Activity:</strong>{' '}
                {userLogs.statistics.last_request
                  ? new Date(userLogs.statistics.last_request).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Action Timeline */}
          <div className="action-timeline">
            <h3>Action Timeline</h3>
            <div className="timeline-items">
              {userLogs.action_timeline.map((action, index) => (
                <div key={index} className="timeline-item">
                  <div className="action-name">{action._id || 'Unknown'}</div>
                  <div className="action-count">{action.count} times</div>
                  <div className="action-date">
                    Last: {new Date(action.last_occurred).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Breakdown */}
          {userLogs.error_breakdown.length > 0 && (
            <div className="error-section">
              <h3>Error Breakdown</h3>
              {userLogs.error_breakdown.map((error, index) => (
                <div key={index} className="error-item">
                  <div className="error-type">{error._id}</div>
                  <div className="error-count">{error.count} errors</div>
                  <div className="error-messages">
                    {error.error_messages.slice(0, 3).map((msg, i) => (
                      <div key={i} className="error-msg">
                        • {msg}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Device Information */}
          <div className="device-info">
            <h3>Devices Used</h3>
            {userLogs.device_info.map((device, index) => (
              <div key={index} className="device-item">
                <span className="device-type">
                  {device._id.device_type || 'Unknown'}
                </span>
                <span className="browser">
                  {device._id.browser || 'Unknown'}
                </span>
                <span className="os">{device._id.os || 'Unknown'}</span>
                <span className="count">{device.count} times</span>
              </div>
            ))}
          </div>

          {/* External API Calls */}
          {userLogs.external_api_calls.length > 0 && (
            <div className="external-apis">
              <h3>External API Calls (CIBIL API)</h3>
              {userLogs.external_api_calls.map((log, index) => (
                <div key={index} className="api-call-item">
                  <div className="api-time">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                  <div className="api-endpoint">{log.endpoint}</div>
                  {log.external_api_calls.map((call, i) => (
                    <div key={i} className="api-details">
                      <span>{call.api_name}</span>
                      <span>{call.duration_ms}ms</span>
                      <span className={call.success ? 'success' : 'failed'}>
                        {call.success ? '✓ Success' : '✗ Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Logs Table */}
          <div className="logs-table">
            <h3>
              All Activity Logs ({userLogs.pagination.total_entries} total)
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Response Time</th>
                  <th>Device</th>
                  <th>Network</th>
                  <th>Error</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userLogs.logs.map(log => (
                  <tr
                    key={log._id}
                    className={log.error_occurred ? 'error-row' : ''}>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>{log.endpoint}</td>
                    <td>
                      <span className={`method-badge ${log.method}`}>
                        {log.method}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${Math.floor(
                          log.response_status / 100,
                        )}xx`}>
                        {log.response_status}
                      </span>
                    </td>
                    <td>{log.response_time_ms}ms</td>
                    <td>{log.client_info?.device_type || '-'}</td>
                    <td>{log.network_info?.connection_type || '-'}</td>
                    <td>{log.error_occurred ? '❌' : '✅'}</td>
                    <td>
                      <button
                        onClick={() => viewLogDetails(log)}
                        className="btn-view">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Log Details</h3>
              <button onClick={() => setSelectedLog(null)}>×</button>
            </div>
            <div className="modal-body">
              <h4>Request Information</h4>
              <pre>{JSON.stringify(selectedLog.request_body, null, 2)}</pre>

              <h4>Response Information</h4>
              <pre>{JSON.stringify(selectedLog.response_body, null, 2)}</pre>

              {selectedLog.error_occurred && (
                <>
                  <h4>Error Details</h4>
                  <p>
                    <strong>Type:</strong> {selectedLog.error_type}
                  </p>
                  <p>
                    <strong>Message:</strong> {selectedLog.error_message}
                  </p>
                </>
              )}

              <h4>Performance</h4>
              <p>
                <strong>Total Time:</strong>{' '}
                {selectedLog.performance?.total_time}ms
              </p>
              <p>
                <strong>DB Query Time:</strong>{' '}
                {selectedLog.performance?.database_query_time}ms
              </p>

              <h4>Client Info</h4>
              <pre>{JSON.stringify(selectedLog.client_info, null, 2)}</pre>

              <h4>Network Info</h4>
              <pre>{JSON.stringify(selectedLog.network_info, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CibilUserLogs;
```

---

## 🎨 CSS for User Logs Component

```css
/* CibilUserLogs.css */

.cibil-user-logs {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.search-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-controls {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.search-controls select,
.search-controls input,
.search-controls button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-controls input {
  flex: 1;
}

.search-controls button {
  background: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  min-width: 120px;
}

.search-controls button:hover {
  background: #45a049;
}

.search-controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.user-info {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 15px;
}

.user-stats {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 15px;
}

.stat-box {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 6px;
  text-align: center;
  border-left: 4px solid #2196f3;
}

.stat-box.success {
  border-left-color: #4caf50;
}

.stat-box.error {
  border-left-color: #f44336;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.time-range {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.action-timeline {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timeline-items {
  display: grid;
  gap: 10px;
  margin-top: 15px;
}

.timeline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #2196f3;
}

.action-name {
  font-weight: bold;
  text-transform: capitalize;
}

.error-section {
  background: #fff5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #ffcdd2;
}

.error-item {
  padding: 15px;
  background: white;
  border-radius: 4px;
  margin-top: 10px;
  border-left: 3px solid #f44336;
}

.error-type {
  font-weight: bold;
  color: #d32f2f;
  text-transform: capitalize;
}

.error-messages {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.device-info {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.device-item {
  display: flex;
  gap: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
  margin-top: 10px;
}

.external-apis {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.api-call-item {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
  margin-top: 10px;
}

.api-details {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  padding: 10px;
  background: white;
  border-radius: 4px;
}

.logs-table {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.logs-table table {
  width: 100%;
  border-collapse: collapse;
}

.logs-table th,
.logs-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.logs-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.error-row {
  background: #fff5f5;
}

.method-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.method-badge.POST {
  background: #4caf50;
  color: white;
}

.method-badge.GET {
  background: #2196f3;
  color: white;
}

.method-badge.PUT {
  background: #ff9800;
  color: white;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-2xx {
  background: #4caf50;
  color: white;
}

.status-4xx {
  background: #ff9800;
  color: white;
}

.status-5xx {
  background: #f44336;
  color: white;
}

.btn-view {
  padding: 6px 12px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-view:hover {
  background: #1976d2;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
```

---

## 🚀 Quick Integration Guide

1. **Import Component** in your admin routes:

```jsx
import CibilUserLogs from './components/CibilUserLogs';

<Route path="/admin/cibil-user-logs" element={<CibilUserLogs />} />;
```

2. **Test the endpoint**:

```bash
curl "https://your-api.com/api/cibil-logs/user-logs?mobile_number=9876543210"
```

3. **Features you get**:

- ✅ Search by mobile, user ID, or PAN
- ✅ Complete user activity timeline
- ✅ Error breakdown with messages
- ✅ Device usage statistics
- ✅ External API call tracking
- ✅ Performance metrics
- ✅ Detailed log viewer

Perfect for debugging user-specific issues! 🎯
