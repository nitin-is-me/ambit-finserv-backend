const AWS = require('aws-sdk');
require('dotenv').config();

module.exports = new AWS.S3({
  accessKeyId: process.env.IM_AWS_ACCESS_KEY_FOR_EXCEL,
  signatureVersion: 'v4',
  region: 'us-east-2',
  secretAccessKey: process.env.IM_AWS_SECRET_KEY_FOR_EXCEL,
});
