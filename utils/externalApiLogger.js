/**
 * Helper to log external API calls (e.g., CIBIL API)
 * Use this when making calls to external services
 */

const logExternalApiCall = async (req, apiCallData) => {
  if (req && req.logExternalApiCall) {
    const {
      apiName,
      endpoint,
      method,
      requestPayload,
      responsePayload,
      statusCode,
      success,
      errorMessage,
      startTime,
      endTime,
    } = apiCallData;

    const duration = endTime && startTime ? endTime - startTime : 0;

    req.logExternalApiCall({
      api_name: apiName,
      endpoint: endpoint,
      method: method,
      request_time: new Date(startTime),
      response_time: new Date(endTime),
      duration_ms: duration,
      status_code: statusCode,
      success: success,
      error_message: errorMessage,
      request_payload: sanitizePayload(requestPayload),
      response_payload: sanitizePayload(responsePayload),
    });
  }
};

/**
 * Sanitize payload to remove sensitive data
 */
const sanitizePayload = payload => {
  if (!payload) return null;

  const sanitized = JSON.parse(JSON.stringify(payload));

  // Remove sensitive fields
  const sensitiveFields = [
    'password',
    'otp',
    'pin',
    'cvv',
    'secret',
    'token',
    'api_key',
    'access_token',
    'refresh_token',
  ];

  const sanitizeObject = obj => {
    if (typeof obj !== 'object' || obj === null) return;

    Object.keys(obj).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        obj[key] = '***REDACTED***';
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    });
  };

  sanitizeObject(sanitized);
  return sanitized;
};

/**
 * Wrapper for axios calls to automatically log
 */
const axios = require('axios');

const loggedAxiosCall = async (req, axiosConfig) => {
  const startTime = Date.now();

  try {
    const response = await axios(axiosConfig);
    const endTime = Date.now();

    await logExternalApiCall(req, {
      apiName: axiosConfig.apiName || 'External API',
      endpoint: axiosConfig.url,
      method: axiosConfig.method || 'GET',
      requestPayload: axiosConfig.data,
      responsePayload: response.data,
      statusCode: response.status,
      success: true,
      errorMessage: null,
      startTime,
      endTime,
    });

    return response;
  } catch (error) {
    const endTime = Date.now();

    await logExternalApiCall(req, {
      apiName: axiosConfig.apiName || 'External API',
      endpoint: axiosConfig.url,
      method: axiosConfig.method || 'GET',
      requestPayload: axiosConfig.data,
      responsePayload: error.response?.data,
      statusCode: error.response?.status,
      success: false,
      errorMessage: error.message,
      startTime,
      endTime,
    });

    throw error;
  }
};

module.exports = {
  logExternalApiCall,
  loggedAxiosCall,
};
