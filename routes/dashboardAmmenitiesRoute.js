const router = require('express').Router();

const addDashboardAmmenities = require('../controllers/dashboard-ammenities/addDashboardAmmenities');
const getDashboardAmmenities = require('../controllers/dashboard-ammenities/getDashboardAmmenities');
const updateDashboardAmmenities = require('../controllers/dashboard-ammenities/updateDashboardAmmenities');
const deleteDashboardAmmenities = require('../controllers/dashboard-ammenities/deleteDashboardAmmenities');

router.put('/update', updateDashboardAmmenities);
router.post('/delete', deleteDashboardAmmenities);
router.post('/add', addDashboardAmmenities);
router.get('/get', getDashboardAmmenities);

module.exports = router;
