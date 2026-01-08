const router = require('express').Router();

const addMediaContact = require('../controllers/media-contacts/addMediaContact');
const getMediaContact = require('../controllers/media-contacts/getMediaContact');
const updateMediaContact = require('../controllers/media-contacts/updateMediaContact');
const deleteMediaContact = require('../controllers/media-contacts/deleteMediaContact');

router.put('/update', updateMediaContact);
router.post('/delete', deleteMediaContact);
router.post('/add', addMediaContact);
router.get('/get', getMediaContact);

module.exports = router;
