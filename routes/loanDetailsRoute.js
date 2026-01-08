const router = require('express').Router();
const uploadLoanDetails = require('../controllers/loanDetails/uploadLoanDetails');
const updateLoanDetails = require('../controllers/loanDetails/updateLoanDetails');
const deleteLoanDetails = require('../controllers/loanDetails/deleteLoanDetails');
const getLoanDetails = require('../controllers/loanDetails/getLoaDetails');
const validateAccountNumber = require('../controllers/loanDetails/validateAccountNumber');

router.post('/upload', uploadLoanDetails);
router.put('/update', updateLoanDetails);
router.post('/delete', deleteLoanDetails);
router.get('/get', getLoanDetails);
router.post('/validate-account-number', validateAccountNumber);

module.exports = router;
