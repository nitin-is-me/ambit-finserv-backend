const router = require('express').Router();
const uploadImage = require('../controllers/upload/uploadImages');
const uploadDocument = require('../controllers/upload/uploadDocuments');

router.post('/uploadImage', uploadImage);
router.post('/uploadDocument', uploadDocument);

module.exports = router;
