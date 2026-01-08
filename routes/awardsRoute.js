const router = require('express').Router();
const addAwards = require('../controllers/awards/addAwards');
const deleteAwards = require('../controllers/awards/deleteAwards');
const getAwards = require('../controllers/awards/getAwards');
const getSingleAwards = require('../controllers/awards/getSingleAwards');
const updateAwards = require('../controllers/awards/updateAwards');

router.delete('/:id', deleteAwards);
router.get('/:id', getSingleAwards);
router.patch('/:id', updateAwards);
router.get('/', getAwards);
router.post('/', addAwards);

module.exports = router;
