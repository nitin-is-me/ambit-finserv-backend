const router = require('express').Router();

const addBranchAddress = require('../controllers/branchAddress/addBranchAddress');
const getBranchAddress = require('../controllers/branchAddress/getBranchAddress');
const updateBranchAddress = require('../controllers/branchAddress/updateBranchAddress');
const deleteBranchAddress = require('../controllers/branchAddress/deleteBranchAddress');
const uploadBranchAddress = require('../controllers/branchAddress/uploadBranchAddress');
const multideleteBranchAddress = require('../controllers/branchAddress/deleteMultiBranchAddress');

router.put('/update', updateBranchAddress);
router.post('/delete', deleteBranchAddress);
router.post('/add', addBranchAddress);
router.get('/get', getBranchAddress);
router.post('/upload', uploadBranchAddress);
router.post('/multidelete', multideleteBranchAddress);
module.exports = router;
