const router = require('express').Router();
const pushEmail = require('../controllers/pushMail/add');

router.post('/send', pushEmail);

module.exports = router;
