const router = require('express').Router();

const addFaq = require('../controllers/faq/addfaq');
const deleteFaq = require('../controllers/faq/deleteFaq');
const getFaq = require('../controllers/faq/getFaq');
const updateFaq = require('../controllers/faq/updateFaq');

router.delete('/:id', deleteFaq);
router.patch('/:id', updateFaq);
router.get('/', getFaq);
router.post('/', addFaq);

module.exports = router;
