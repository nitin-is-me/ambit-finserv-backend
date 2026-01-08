/**
 * Middleware to validate IP whitelist for CIBIL API calls
 * Only allows requests from whitelisted production IPs
 */
const cibilIPWhitelist = (req, res, next) => {
  // Production whitelisted IPs
  const whitelistedIPs = [
    '3.108.103.172', // Production IP from CIBIL
    '127.0.0.1', // Localhost for development
    '::1', // IPv6 localhost
  ];

  // Get client IP address
  const clientIP =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim();

  // Check if IP is whitelisted
  if (!whitelistedIPs.includes(clientIP)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. IP address not whitelisted for CIBIL API calls.',
      clientIP: clientIP,
      whitelistedIPs: whitelistedIPs,
    });
  }

  next();
};

module.exports = cibilIPWhitelist;
