const router = require('express').Router();
const uploadQrs = require('../controllers/qrCodes/uploadQrCodes');
const getQrCodes = require('../controllers/qrCodes/getQrCodes');

router.post('/upload', uploadQrs);
router.get('/qrcodes/:loan_id?', getQrCodes);

module.exports = router;
