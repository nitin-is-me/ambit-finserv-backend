const router = require('express').Router();
const addEAuction = require('../controllers/eAuction/addEAuction');
const deleteEAuction = require('../controllers/eAuction/deleteEAuction');
const editEAuction = require('../controllers/eAuction/editEAuction');
const getEAuction = require('../controllers/eAuction/getEAuction');
const singleEAuction = require('../controllers/eAuction/singleEAuction');

router.delete('/:id', deleteEAuction);
router.get('/:id', singleEAuction);
router.patch('/:id', editEAuction);
router.get('/', getEAuction);
router.post('/', addEAuction);

module.exports = router;
