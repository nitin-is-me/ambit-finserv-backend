const jwt = require('jsonwebtoken');

const createToken = (payload, secret, expireTime) =>
  jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });

const verifyToken = (token, secret) => jwt.verify(token, secret);

const jwtHelpers = {
  createToken,
  verifyToken,
};

module.exports = jwtHelpers;
