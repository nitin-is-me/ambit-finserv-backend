const wrapperRoute = require('express').Router();
const ping = require('../controllers/wrapper/ping');
const getCustomerAssets = require('../controllers/wrapper/getCustomersAssets');
const getAuthenticationQuestions = require('../controllers/wrapper/getAuthenticationQuestions');
const verifyAuthenticationAnswers = require('../controllers/wrapper/verifyAuthenticationAnswers');
const fulFillOffer = require('../controllers/wrapper/fulFillOffer');
const getProductWebToken = require('../controllers/wrapper/getProductWebToken');

// Apply IP whitelist middleware to all CIBIL API routes
wrapperRoute.get('/ping', ping);
wrapperRoute.post('/getCustomerAssets', getCustomerAssets);
wrapperRoute.post(
  '/getAuthenticationQuestions',

  getAuthenticationQuestions,
);
wrapperRoute.post('/verifyAuthenticationAnswers', verifyAuthenticationAnswers);
wrapperRoute.post('/fulFillOffer', fulFillOffer);
wrapperRoute.post('/getProductWebToken', getProductWebToken);

module.exports = wrapperRoute;
