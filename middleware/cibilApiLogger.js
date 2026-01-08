const os = require('os');
const CibilApiLog = require('../model/cibilApiLogModel');

/**
 * Middleware to log all CIBIL-related API calls
 */
const cibilApiLogger = async (req, res, next) => {
  const startTime = Date.now();

  // Generate unique request ID
  const requestId =
    req.headers['x-request-id'] ||
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Extract client information from headers
  const clientInfo = {
    ip_address: req.ip || req.connection.remoteAddress || '',
    user_agent: req.headers['user-agent'] || '',
    browser: req.headers['x-browser'] || '',
    browser_version: req.headers['x-browser-version'] || '',
    os: req.headers['x-os'] || '',
    device_type: req.headers['x-device-type'] || '',
    screen_resolution: req.headers['x-screen-resolution'] || '',
    timezone: req.headers['x-timezone'] || '',
    language: req.headers['accept-language'] || '',
  };

  // Extract network information from headers (sent from frontend)
  const networkInfo = {
    connection_type: req.headers['x-connection-type'] || '',
    effective_type: req.headers['x-effective-type'] || '',
    downlink: req.headers['x-downlink']
      ? parseFloat(req.headers['x-downlink'])
      : null,
    rtt: req.headers['x-rtt'] ? parseInt(req.headers['x-rtt']) : null,
    save_data: req.headers['x-save-data'] === 'true',
  };

  // Extract business context from request
  const businessContext = {
    action_type: req.headers['x-action-type'] || '',
    data_source: req.headers['x-data-source'] || 'web',
    utm_source: req.body.utm_source || req.query.utm_source || '',
    utm_medium: req.body.utm_medium || req.query.utm_medium || '',
    utm_campaign: req.body.utm_campaign || req.query.utm_campaign || '',
  };

  // Create initial log entry
  const logEntry = {
    endpoint: req.originalUrl || req.url,
    method: req.method,
    request_body: sanitizeRequestBody(req.body),
    request_headers: sanitizeHeaders(req.headers),
    request_params: req.params,
    request_query: req.query,
    client_info: clientInfo,
    network_info: networkInfo,
    business_context: businessContext,
    session_id: req.headers['x-session-id'] || '',
    request_id: requestId,
    environment: process.env.NODE_ENV || 'development',
    server_info: {
      hostname: os.hostname(),
      node_version: process.version,
      server_time: new Date(),
    },
    is_retry: req.headers['x-is-retry'] === 'true',
    retry_count: parseInt(req.headers['x-retry-count']) || 0,
    external_api_calls: [],
  };

  // Store original res.json to capture response
  const originalJson = res.json.bind(res);

  res.json = function jsonResponse(body) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Update log entry with response data
    logEntry.response_status = res.statusCode;
    logEntry.response_body = sanitizeResponseBody(body);
    logEntry.response_time_ms = responseTime;

    // Check if error occurred
    if (res.statusCode >= 400 || !body.success) {
      logEntry.error_occurred = true;
      logEntry.error_message = body.message || 'Unknown error';
      logEntry.error_type = determineErrorType(res.statusCode, body);
    }

    // Extract user identification from request/response
    if (req.body.mobile_number) {
      logEntry.mobile_number = req.body.mobile_number;
    }
    if (req.body.IdentifierId) {
      logEntry.IdentifierId = req.body.IdentifierId;
    }
    if (req.body.id) {
      logEntry.user_id = req.body.id;
    }
    if (body.data && body.data.id) {
      logEntry.user_id = body.data.id;
    }
    if (body.data && body.data.mobile_number) {
      logEntry.mobile_number = body.data.mobile_number;
    }
    if (body.data && body.data.IdentifierId) {
      logEntry.IdentifierId = body.data.IdentifierId;
    }

    // Determine business context
    if (body.isExistingUser !== undefined) {
      logEntry.business_context.is_existing_user = body.isExistingUser;
      logEntry.business_context.is_new_user = !body.isExistingUser;
    }
    if (body.userExists !== undefined) {
      logEntry.business_context.is_existing_user = body.userExists;
    }

    // Performance metrics
    logEntry.performance = {
      total_time: responseTime,
      database_query_time: req.dbQueryTime || 0,
      validation_time: req.validationTime || 0,
      processing_time: req.processingTime || 0,
    };

    // Save log to database (async, don't wait)
    saveCibilLog(logEntry);

    return originalJson(body);
  };

  // Store original res.status to capture errors
  const originalStatus = res.status.bind(res);
  res.status = function statusResponse(statusCode) {
    if (statusCode >= 400) {
      logEntry.error_occurred = true;
      logEntry.is_timeout = statusCode === 408 || statusCode === 504;
      logEntry.is_rate_limited = statusCode === 429;
    }
    return originalStatus(statusCode);
  };

  // Attach request ID to request for use in controllers
  req.requestId = requestId;
  req.logExternalApiCall = apiCallData => {
    logEntry.external_api_calls.push(apiCallData);
  };

  next();
};

/**
 * Save log to database
 */
const saveCibilLog = async logEntry => {
  try {
    await CibilApiLog.create(logEntry);
  } catch (error) {
    // Don't let logging errors affect the main request
  }
};

/**
 * Sanitize request body to remove sensitive data
 */
const sanitizeRequestBody = body => {
  if (!body) return {};

  const sanitized = {...body};

  // Remove sensitive fields
  const sensitiveFields = ['password', 'otp', 'pin', 'cvv', 'secret'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};

/**
 * Sanitize headers to remove sensitive data
 */
const sanitizeHeaders = headers => {
  if (!headers) return {};

  const sanitized = {...headers};

  // Remove sensitive headers
  const sensitiveHeaders = [
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token',
  ];
  sensitiveHeaders.forEach(header => {
    if (sanitized[header]) {
      sanitized[header] = '***REDACTED***';
    }
  });

  return sanitized;
};

/**
 * Sanitize response body
 */
const sanitizeResponseBody = body => {
  if (!body) return {};

  const sanitized = {...body};

  // Remove sensitive fields from response
  if (sanitized.data && typeof sanitized.data === 'object') {
    const sensitiveFields = ['otp', 'password', 'secret', 'token'];
    sensitiveFields.forEach(field => {
      if (sanitized.data[field]) {
        sanitized.data[field] = '***REDACTED***';
      }
    });
  }

  return sanitized;
};

/**
 * Determine error type based on status code and response
 */
const determineErrorType = (statusCode, body) => {
  if (statusCode === 422) return 'validation_error';
  if (statusCode === 401) return 'authentication_error';
  if (statusCode === 403) return 'authorization_error';
  if (statusCode === 408 || statusCode === 504) return 'timeout_error';
  if (statusCode === 429) return 'rate_limit_error';
  if (statusCode >= 500) return 'database_error';

  // Check body message for specific errors
  if (body.message) {
    const message = body.message.toLowerCase();
    if (message.includes('validation')) return 'validation_error';
    if (message.includes('database') || message.includes('mongo'))
      return 'database_error';
    if (message.includes('network') || message.includes('connection'))
      return 'network_error';
    if (message.includes('timeout')) return 'timeout_error';
    if (message.includes('external') || message.includes('cibil'))
      return 'external_api_error';
  }

  return 'unknown_error';
};

module.exports = cibilApiLogger;
