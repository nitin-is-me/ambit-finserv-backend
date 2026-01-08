const router = require('express').Router();

const addAddress = require('../controllers/addresses/addAddress');
const deleteAddress = require('../controllers/addresses/deleteAddress');
const getAddress = require('../controllers/addresses/getAddress');
const updateAddress = require('../controllers/addresses/updateAddress');

router.delete('/:id', deleteAddress);
router.patch('/:id', updateAddress);
router.get('/', getAddress);
router.post('/', addAddress);

module.exports = router;
