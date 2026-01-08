const express = require('express');
const {createQrForm} = require('../controllers/qr-form/createQrForm');
const {getQrForm} = require('../controllers/qr-form/getQrForm');
const router = express.Router();

router.post('/create', createQrForm);
router.get('/get', getQrForm);

module.exports = router;
