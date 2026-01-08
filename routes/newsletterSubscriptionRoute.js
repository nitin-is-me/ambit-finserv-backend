const router = require('express').Router();
const addNewsletterSubscription = require('../controllers/newsletterSubscription/addNewsLetter');
const updateNewsletterSubscription = require('../controllers/newsletterSubscription/updateNewsLetter');
const deleteNewsletterSubscription = require('../controllers/newsletterSubscription/deleteNewsLetter');
const getNewsletterSubscription = require('../controllers/newsletterSubscription/getNewsLetter');

router.post('/add', addNewsletterSubscription);
router.put('/update', updateNewsletterSubscription);
router.post('/delete', deleteNewsletterSubscription);
router.get('/get', getNewsletterSubscription);
module.exports = router;
