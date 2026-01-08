# Get CIBIL Users with Activity Logs

## 📊 Enhanced API: Get CIBIL Users

The `GET /api/cibil-score/get` endpoint has been enhanced to optionally include activity logs for each user.

---

## 🔍 API Endpoints

### **1. Get Users WITHOUT Logs (Default)**

```bash
GET /api/cibil-score/get
```

**Response:** Standard user data only (fast)

```json
{
  "success": true,
  "message": "All Cibil users fetched successfully",
  "logs_included": false,
  "data": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "first_name": "John",
      "last_name": "Doe",
      "mobile_number": "9876543210",
      "cibil_score": 750
      // ... other user fields
    }
  ]
}
```

---

### **2. Get Users WITH Logs (Enhanced)**

```bash
GET /api/cibil-score/get?include_logs=true
```

**Query Parameters:**

- `include_logs` - Set to `true` to include activity logs (default: `false`)
- `log_limit` - Number of recent logs per user (default: `5`, max recommended: `20`)

**Response:** User data + activity logs

```json
{
  "success": true,
  "message": "All Cibil users fetched successfully",
  "logs_included": true,
  "data": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "first_name": "John",
      "last_name": "Doe",
      "mobile_number": "9876543210",
      "cibil_score": 750,
      // ... other user fields

      "activity": {
        "stats": {
          "total_requests": 25,
          "total_errors": 2,
          "avg_response_time": 245.5,
          "last_activity": "2023-10-09T15:45:00.000Z"
        },
        "recent_logs": [
          {
            "_id": "...",
            "endpoint": "/api/cibil-score/update",
            "method": "PUT",
            "response_status": 200,
            "response_time_ms": 150,
            "error_occurred": false,
            "createdAt": "2023-10-09T15:45:00.000Z",
            "business_context": {
              "action_type": "update_user"
            }
          },
          {
            "_id": "...",
            "endpoint": "/api/cibil-score/get",
            "method": "GET",
            "response_status": 200,
            "response_time_ms": 89,
            "error_occurred": false,
            "createdAt": "2023-10-09T15:40:00.000Z",
            "business_context": {
              "action_type": "fetch_user"
            }
          }
        ],
        "error_breakdown": [
          {
            "_id": "validation_error",
            "count": 1
          },
          {
            "_id": "network_error",
            "count": 1
          }
        ]
      }
    }
  ]
}
```

---

## 🎯 Use Cases

### **1. Admin Dashboard - User List**

**Without Logs (Fast Loading):**

```javascript
// Use for initial table load
fetch('https://your-api.com/api/cibil-score/get');
```

**With Logs (Rich Data):**

```javascript
// Use when you need activity insights
fetch(
  'https://your-api.com/api/cibil-score/get?include_logs=true&log_limit=10',
);
```

---

### **2. Admin Panel Display**

```jsx
const CibilUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [includeLogs, setIncludeLogs] = useState(false);

  const fetchUsers = async () => {
    const url = includeLogs
      ? 'https://your-api.com/api/cibil-score/get?include_logs=true&log_limit=5'
      : 'https://your-api.com/api/cibil-score/get';

    const response = await fetch(url);
    const data = await response.json();
    setUsers(data.data);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={includeLogs}
          onChange={e => setIncludeLogs(e.target.checked)}
        />
        Include Activity Logs
      </label>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>CIBIL Score</th>
            {includeLogs && (
              <>
                <th>Total Requests</th>
                <th>Errors</th>
                <th>Last Activity</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                {user.first_name} {user.last_name}
              </td>
              <td>{user.mobile_number}</td>
              <td>{user.cibil_score || 'N/A'}</td>
              {includeLogs && user.activity && (
                <>
                  <td>{user.activity.stats.total_requests}</td>
                  <td
                    className={
                      user.activity.stats.total_errors > 0 ? 'error' : ''
                    }>
                    {user.activity.stats.total_errors}
                  </td>
                  <td>
                    {new Date(
                      user.activity.stats.last_activity,
                    ).toLocaleString()}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 📊 What You Get Per User (When include_logs=true)

### **Activity Stats:**

- `total_requests` - Total API calls for this user
- `total_errors` - Total failed requests
- `avg_response_time` - Average response time (ms)
- `last_activity` - Last API call timestamp

### **Recent Logs:**

- Last N logs (configurable via `log_limit`)
- Contains: endpoint, method, status, response time, errors
- Action type (create_user, update_user, etc.)

### **Error Breakdown:**

- Count of each error type
- Helps identify recurring issues

---

## ⚡ Performance Considerations

### **Without Logs:**

- ✅ Fast (single DB query)
- ✅ Lightweight response
- ✅ Best for: Initial page load, mobile apps

### **With Logs:**

- ⚠️ Slower (multiple DB queries per user)
- ⚠️ Larger response size
- ✅ Best for: Admin panels, detailed views, debugging

**Recommendation:**

- Use `include_logs=false` for listing/browsing
- Use `include_logs=true` when you need insights
- Keep `log_limit` small (5-10) for better performance

---

## 🎨 Example Admin Panel Components

### **Component 1: User Card with Activity**

```jsx
const UserCard = ({user}) => {
  return (
    <div className="user-card">
      <div className="user-info">
        <h3>
          {user.first_name} {user.last_name}
        </h3>
        <p>Mobile: {user.mobile_number}</p>
        <p>CIBIL Score: {user.cibil_score || 'Pending'}</p>
      </div>

      {user.activity && (
        <div className="user-activity">
          <h4>Activity Summary</h4>
          <div className="activity-stats">
            <div className="stat">
              <span className="value">
                {user.activity.stats.total_requests}
              </span>
              <span className="label">Requests</span>
            </div>
            <div className="stat error">
              <span className="value">{user.activity.stats.total_errors}</span>
              <span className="label">Errors</span>
            </div>
            <div className="stat">
              <span className="value">
                {user.activity.stats.avg_response_time?.toFixed(0)}ms
              </span>
              <span className="label">Avg Time</span>
            </div>
          </div>

          <h5>Recent Activity</h5>
          <ul className="recent-logs">
            {user.activity.recent_logs.map(log => (
              <li key={log._id}>
                <span className="time">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
                <span className="action">
                  {log.business_context?.action_type || log.endpoint}
                </span>
                <span
                  className={`status ${log.error_occurred ? 'error' : 'success'}`}>
                  {log.error_occurred ? '❌' : '✅'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

### **Component 2: Users Table with Toggle**

```jsx
const EnhancedUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = showLogs
        ? '/api/cibil-score/get?include_logs=true&log_limit=5'
        : '/api/cibil-score/get';

      const response = await fetch(url);
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [showLogs]);

  return (
    <div className="users-table-container">
      <div className="controls">
        <button onClick={() => setShowLogs(!showLogs)}>
          {showLogs ? '📊 Hide Activity' : '📈 Show Activity'}
        </button>
      </div>

      {loading && <div>Loading...</div>}

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>PAN</th>
            <th>CIBIL Score</th>
            {showLogs && (
              <>
                <th>API Calls</th>
                <th>Errors</th>
                <th>Last Seen</th>
                <th>Health</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                {user.first_name} {user.last_name}
              </td>
              <td>{user.mobile_number}</td>
              <td>{user.IdentifierId}</td>
              <td>
                <span className="cibil-score">{user.cibil_score || 'N/A'}</span>
              </td>
              {showLogs && user.activity && (
                <>
                  <td>{user.activity.stats.total_requests}</td>
                  <td>
                    <span
                      className={
                        user.activity.stats.total_errors > 0 ? 'has-errors' : ''
                      }>
                      {user.activity.stats.total_errors}
                    </span>
                  </td>
                  <td>
                    {user.activity.stats.last_activity
                      ? new Date(
                          user.activity.stats.last_activity,
                        ).toLocaleString()
                      : 'Never'}
                  </td>
                  <td>{getHealthStatus(user.activity.stats)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getHealthStatus = stats => {
  const errorRate =
    stats.total_requests > 0
      ? (stats.total_errors / stats.total_requests) * 100
      : 0;

  if (errorRate === 0) return '🟢 Healthy';
  if (errorRate < 10) return '🟡 Warning';
  return '🔴 Critical';
};
```

---

## 🚀 API Examples

### **Basic Request:**

```bash
curl "https://your-api.com/api/cibil-score/get"
```

### **With Logs (5 recent logs per user):**

```bash
curl "https://your-api.com/api/cibil-score/get?include_logs=true"
```

### **With Logs (10 recent logs per user):**

```bash
curl "https://your-api.com/api/cibil-score/get?include_logs=true&log_limit=10"
```

---

## ✅ Benefits

1. **Single API Call** - Get user data + activity in one request
2. **Flexible** - Choose to include logs or not
3. **Performance** - Configurable log limit
4. **Complete Picture** - See user health at a glance
5. **Admin-Friendly** - Perfect for dashboards
6. **Debugging** - Quickly identify problematic users

---

## 📝 Summary

| Parameter      | Type    | Default | Description                         |
| -------------- | ------- | ------- | ----------------------------------- |
| `include_logs` | boolean | `false` | Include activity logs for each user |
| `log_limit`    | number  | `5`     | Number of recent logs per user      |

**Use `include_logs=true` when:**

- Building admin dashboards
- Debugging user issues
- Monitoring user activity
- Generating reports

**Use `include_logs=false` when:**

- Initial page load
- Mobile apps
- Need faster response
- Only need user data

🎉 **The enhanced API is ready to use!**
