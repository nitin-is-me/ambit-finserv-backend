const router = require('express').Router();

const addPartnerships = require('../controllers/partnerships/addPartnerships');
const deletePartnerships = require('../controllers/partnerships/deletePartnerships');
const getPartnerships = require('../controllers/partnerships/getPartnerships');
const updatePartnerships = require('../controllers/partnerships/updatePartnerships');

router.delete('/:id', deletePartnerships);
router.patch('/:id', updatePartnerships);
router.get('/', getPartnerships);
router.post('/', addPartnerships);

module.exports = router;
