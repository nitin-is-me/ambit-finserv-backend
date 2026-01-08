/**
 * Frontend Logging Helper
 *
 * This file contains JavaScript code that should be used in your frontend
 * to send additional context and debugging information to the backend.
 *
 * Copy this code to your frontend application and include it in your API calls.
 */

/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/**
 * Frontend JavaScript Helper - This file is meant for browser use
 * Copy this to your frontend application
 */

/**
 * Get client information from browser
 */
const getClientInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let browserVersion = 'Unknown';
  let os = 'Unknown';
  let deviceType = 'desktop';

  // Detect browser
  if (userAgent.indexOf('Chrome') > -1) {
    browser = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Safari') > -1) {
    browser = 'Safari';
    browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browser = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Edge') > -1) {
    browser = 'Edge';
    browserVersion = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
  }

  // Detect OS
  if (userAgent.indexOf('Windows') > -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
  else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
  else if (userAgent.indexOf('Android') > -1) os = 'Android';
  else if (userAgent.indexOf('iOS') > -1) os = 'iOS';

  // Detect device type
  if (/Mobile|Android|iPhone/i.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/iPad|Tablet/i.test(userAgent)) {
    deviceType = 'tablet';
  }

  return {
    browser,
    browserVersion,
    os,
    deviceType,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };
};

/**
 * Get network information from browser
 */
const getNetworkInfo = () => {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (connection) {
    return {
      connectionType: connection.type || 'unknown',
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false,
    };
  }

  return {
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false,
  };
};

/**
 * Generate unique session ID
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('app_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('app_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Generate unique request ID
 */
const generateRequestId = () =>
  `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Create enhanced headers for API calls
 */
const createEnhancedHeaders = (actionType = '', additionalHeaders = {}) => {
  const clientInfo = getClientInfo();
  const networkInfo = getNetworkInfo();
  const sessionId = getSessionId();
  const requestId = generateRequestId();

  return {
    'Content-Type': 'application/json',

    // Client Information
    'X-Browser': clientInfo.browser,
    'X-Browser-Version': clientInfo.browserVersion,
    'X-OS': clientInfo.os,
    'X-Device-Type': clientInfo.deviceType,
    'X-Screen-Resolution': clientInfo.screenResolution,
    'X-Timezone': clientInfo.timezone,

    // Network Information
    'X-Connection-Type': networkInfo.connectionType,
    'X-Effective-Type': networkInfo.effectiveType,
    'X-Downlink': networkInfo.downlink.toString(),
    'X-RTT': networkInfo.rtt.toString(),
    'X-Save-Data': networkInfo.saveData.toString(),

    // Session and Request Tracking
    'X-Session-ID': sessionId,
    'X-Request-ID': requestId,

    // Business Context
    'X-Action-Type': actionType,
    'X-Data-Source': 'web', // or 'mobile_app'

    // Merge additional headers
    ...additionalHeaders,
  };
};

/**
 * Enhanced fetch wrapper with automatic logging
 */
const fetchWithLogging = async (url, options = {}, actionType = '') => {
  const startTime = Date.now();

  try {
    const enhancedOptions = {
      ...options,
      headers: createEnhancedHeaders(actionType, options.headers || {}),
    };

    const response = await fetch(url, enhancedOptions);
    const endTime = Date.now();

    // Log successful request
    console.log('[API Call Success]', {
      url,
      method: options.method || 'GET',
      duration: endTime - startTime,
      status: response.status,
    });

    return response;
  } catch (error) {
    const endTime = Date.now();

    // Log failed request
    console.error('[API Call Failed]', {
      url,
      method: options.method || 'GET',
      duration: endTime - startTime,
      error: error.message,
    });

    throw error;
  }
};

/**
 * Retry logic with logging
 */
const fetchWithRetry = async (
  url,
  options = {},
  actionType = '',
  maxRetries = 3,
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Add retry information to headers
      const retryHeaders = {
        'X-Is-Retry': i > 0 ? 'true' : 'false',
        'X-Retry-Count': i.toString(),
      };

      const response = await fetchWithLogging(
        url,
        {
          ...options,
          headers: {
            ...options.headers,
            ...retryHeaders,
          },
        },
        actionType,
      );

      return response;
    } catch (error) {
      lastError = error;

      // Wait before retry (exponential backoff)
      if (i < maxRetries - 1) {
        const waitTime = 2 ** i * 1000; // 1s, 2s, 4s
        await new Promise(resolve => {
          setTimeout(resolve, waitTime);
        });
      }
    }
  }

  throw lastError;
};

// Export for use in your frontend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getClientInfo,
    getNetworkInfo,
    getSessionId,
    generateRequestId,
    createEnhancedHeaders,
    fetchWithLogging,
    fetchWithRetry,
  };
}
