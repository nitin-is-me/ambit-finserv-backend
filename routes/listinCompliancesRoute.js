const router = require('express').Router();

const addCompliances = require('../controllers/listing-compliances/addCompliances');
const getCompliances = require('../controllers/listing-compliances/getCompliances');
const updateCompliances = require('../controllers/listing-compliances/updateCompliances');
const deleteCompliances = require('../controllers/listing-compliances/deleteCompliances');

router.put('/update', updateCompliances);
router.post('/delete', deleteCompliances);
router.post('/add', addCompliances);
router.get('/get', getCompliances);

module.exports = router;
