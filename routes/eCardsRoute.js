const router = require('express').Router();

const addECards = require('../controllers/ecard/addECard');
const getECards = require('../controllers/ecard/getECard');
const deleteECards = require('../controllers/ecard/deleteECard');

router.post('/delete', deleteECards);
router.post('/add', addECards);
router.get('/get', getECards);

module.exports = router;
