const router = require('express').Router();
const getCibilLogs = require('../controllers/cibil-logs/getCibilLogs');
const getCibilLogStats = require('../controllers/cibil-logs/getCibilLogStats');
const getCibilUserLogs = require('../controllers/cibil-logs/getCibilUserLogs');

// Get CIBIL API logs with filters
router.get('/logs', getCibilLogs);

// Get CIBIL API statistics
router.get('/stats', getCibilLogStats);

// Get logs for a specific CIBIL user
router.get('/user-logs', getCibilUserLogs);

module.exports = router;
