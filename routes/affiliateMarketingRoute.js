const router = require('express').Router();

const addAffiliateMarketing = require('../controllers/affiliate-marketing/addAffiliateMarketing');
const checkAffiliateMarketing = require('../controllers/affiliate-marketing/checkAffiliateMarketing');
const deleteAffiliateMarketing = require('../controllers/affiliate-marketing/deleteAffiliateMarketing');
const getAffiliateMarketing = require('../controllers/affiliate-marketing/getAffiliateMarketing');
const updateAffiliateMarketing = require('../controllers/affiliate-marketing/updateAffiliateMarketing');

router.put('/update', updateAffiliateMarketing);
router.post('/delete', deleteAffiliateMarketing);
router.post('/add', addAffiliateMarketing);
router.post('/check', checkAffiliateMarketing);
router.get('/get', getAffiliateMarketing);

module.exports = router;
