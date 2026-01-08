const jwt = require('jsonwebtoken');

const authRole = () => async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'You are not authorized',
      });
    }
    // verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid token',
        });
      }
      const {expiry} = decoded;
      const currentTime = new Date().getTime();
      if (currentTime > expiry) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      req.id = decoded.userId;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = authRole;
