const router = require('express').Router();

const addDisclosure = require('../controllers/disclosures/addDisclosures');
const deleteDisclosure = require('../controllers/disclosures/deleteDisclosures');
const getDisclosure = require('../controllers/disclosures/getDisclosures');
const updateDisclosure = require('../controllers/disclosures/updateDisclosures');

router.put('/update', updateDisclosure);
router.post('/delete', deleteDisclosure);
router.post('/add', addDisclosure);
router.get('/get', getDisclosure);

module.exports = router;
