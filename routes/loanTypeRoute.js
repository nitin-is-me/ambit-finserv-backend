const router = require('express').Router();

const addLoanType = require('../controllers/loanType/addLoanType');
const getLoanType = require('../controllers/loanType/getLoanType');

router.post('/', addLoanType);
router.get('/get', getLoanType);

module.exports = router;
