const router = require('express').Router();

const addCareer = require('../controllers/career/addCareer');
const getCareer = require('../controllers/career/getCareer');
const updateCareer = require('../controllers/career/updateCareer');
const deleteCareer = require('../controllers/career/deleteCareer');
const uploadCareer = require('../controllers/career/uploadCareer');
const search = require('../controllers/career/search');
const getSingleCareer = require('../controllers/career/getSingleCareer');

router.put('/update', updateCareer);
router.post('/delete', deleteCareer);
router.post('/add', addCareer);
router.get('/get', getCareer);
router.post('/upload', uploadCareer);
router.get('/search', search);
router.post('/getCareerDetails', getSingleCareer);

module.exports = router;
