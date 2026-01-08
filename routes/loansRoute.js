const router = require('express').Router();

const addLoan = require('../controllers/loans/addLoans');
const getLoans = require('../controllers/loans/getLoans');
const updateLoan = require('../controllers/loans/updateLoans');
const deleteLoan = require('../controllers/loans/deleteLoans');

router.put('/update', updateLoan);
router.post('/delete', deleteLoan);
router.post('/add', addLoan);
router.get('/get', getLoans);

module.exports = router;
