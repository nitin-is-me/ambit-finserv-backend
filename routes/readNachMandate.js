const router = require('express').Router();

const getNachMandate = require('../controllers/readNachMandate/readNachMandate');

router.get('/get', getNachMandate);

module.exports = router;
