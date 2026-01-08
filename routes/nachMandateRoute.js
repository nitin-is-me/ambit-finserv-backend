const router = require('express').Router();
const addNachMandate = require('../controllers/nachMandate/addNachMandate');
const updateNachMandate = require('../controllers/nachMandate/updateNachMandate');
const deleteNachMandate = require('../controllers/nachMandate/deleteNachMandate');
const getNachMandate = require('../controllers/nachMandate/getNachMandate');

router.post('/add', addNachMandate);
router.put('/update', updateNachMandate);
router.post('/delete', deleteNachMandate);
router.get('/get', getNachMandate);
module.exports = router;
