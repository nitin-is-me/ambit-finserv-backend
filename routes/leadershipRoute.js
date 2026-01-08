const router = require('express').Router();
const addLeadership = require('../controllers/leadership/addLeadership');
const updateLeadership = require('../controllers/leadership/updateLeadership');
const deleteLeadership = require('../controllers/leadership/deleteLeadership');
const getLeadership = require('../controllers/leadership/getLeadership');

router.post('/add', addLeadership);
router.put('/update', updateLeadership);
router.post('/delete', deleteLeadership);
router.get('/get', getLeadership);
module.exports = router;
