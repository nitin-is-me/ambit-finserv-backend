const router = require('express').Router();

const addAnnualReports = require('../controllers/annual-reports/addAnnualReports');
const getAnnualReports = require('../controllers/annual-reports/getAnnualReports');
const updateAnnualReports = require('../controllers/annual-reports/updateAnnualReports');
const deleteAnnualReports = require('../controllers/annual-reports/deleteAnnualReports');

router.put('/update', updateAnnualReports);
router.post('/delete', deleteAnnualReports);
router.post('/add', addAnnualReports);
router.get('/get', getAnnualReports);

module.exports = router;
