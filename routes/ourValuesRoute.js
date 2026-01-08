const router = require('express').Router();

const addValues = require('../controllers/ourValues/addValues');
const deleteValues = require('../controllers/ourValues/deleteValues');
const getSingleValue = require('../controllers/ourValues/getSingleValue');
const getValues = require('../controllers/ourValues/getValues');
const updateValues = require('../controllers/ourValues/updateValues');

router.put('/:id', updateValues);
router.delete('/:id', deleteValues);
router.get('/:id', getSingleValue);
router.post('/', addValues);
router.get('/', getValues);
module.exports = router;
