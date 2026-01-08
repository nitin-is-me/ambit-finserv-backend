const router = require('express').Router();

const addResume = require('../controllers/jobResume/addResume');
const getResume = require('../controllers/jobResume/getResume');
const updateResume = require('../controllers/jobResume/updateResume');
const deleteResume = require('../controllers/jobResume/deleteResume');

router.put('/update', updateResume);
router.post('/delete', deleteResume);
router.post('/add', addResume);
router.get('/get', getResume);

module.exports = router;
