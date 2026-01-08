const router = require('express').Router();
const addTestimonial = require('../controllers/testimonial/addTestimonial');
const updateTestimonial = require('../controllers/testimonial/updateTestimonial');
const deleteTestimonial = require('../controllers/testimonial/deleteTestimonial');
const getTestimonial = require('../controllers/testimonial/getTestimonial');

router.post('/add', addTestimonial);
router.put('/update', updateTestimonial);
router.post('/delete', deleteTestimonial);
router.get('/get', getTestimonial);
module.exports = router;
