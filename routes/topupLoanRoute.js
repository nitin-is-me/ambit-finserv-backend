const router = require('express').Router();

const addTopupLoan = require('../controllers/topupLoan/addTopupLoan');
const getTopupLoan = require('../controllers/topupLoan/getTopUpLoan');
const checkMobileNumber = require('../controllers/topupLoan/checkMobileNumber');

router.post('/add', addTopupLoan);
router.get('/get', getTopupLoan);
router.post('/check-mobile', checkMobileNumber);

module.exports = router;
