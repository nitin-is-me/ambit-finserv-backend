const router = require('express').Router();

const addPolicies = require('../controllers/policies/addPolicies');
const deletePolicies = require('../controllers/policies/deletePolicies');
const getPolicies = require('../controllers/policies/getPolicies');
const updatePolicies = require('../controllers/policies/updatePolicies');

router.put('/update', updatePolicies);
router.post('/delete', deletePolicies);
router.post('/add', addPolicies);
router.get('/get', getPolicies);

module.exports = router;
