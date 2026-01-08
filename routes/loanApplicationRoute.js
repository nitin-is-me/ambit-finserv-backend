const router = require('express').Router();

const addLoanApplications = require('../controllers/loan-applications/addLoanApplication');
const getLoanApplications = require('../controllers/loan-applications/getLoanApplication');
const updateLoanApplications = require('../controllers/loan-applications/updateLoanApplication');
const deleteLoanApplications = require('../controllers/loan-applications/deleteLoanApplication');
const checkLoanApplications = require('../controllers/loan-applications/checkLoanApplication');
const getLoanApplicationByID = require('../controllers/loan-applications/getLoanApplicationByID');
const getLeadIdByPhone = require('../controllers/loan-applications/getLeadIdByPhone');

router.put('/update', updateLoanApplications);
router.post('/delete', deleteLoanApplications);
router.post('/add', addLoanApplications);
router.post('/check', checkLoanApplications);
router.post('/getLeadIdByPhone', getLeadIdByPhone);
router.get('/get', getLoanApplications);
router.get('/getId', getLoanApplicationByID);

module.exports = router;
