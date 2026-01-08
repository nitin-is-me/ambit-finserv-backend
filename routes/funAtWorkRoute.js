const router = require('express').Router();

const addFunAtWork = require('../controllers/funAtWork/addFunAtWork');
const deleteFunAtWork = require('../controllers/funAtWork/deleteFunAtWork');
const getFunAtWork = require('../controllers/funAtWork/getFunAtWork');
const updateFunAtWork = require('../controllers/funAtWork/updateSingleFunWork');
const updateSingleFunWork = require('../controllers/funAtWork/updateSingleFunWork');
const deleteSingleWorkImage = require('../controllers/funAtWork/deleteSingleFunAtWork');
const getSingleFunAtWork = require('../controllers/funAtWork/getSingleFunAtWork');
const addSingleFunAtWork = require('../controllers/funAtWork/addSingleFunAtWork');
const updateFullFunAtWork = require('../controllers/funAtWork/updateFullWork');

router.put('/update', updateFunAtWork);
router.put('/updateSingle', updateSingleFunWork);
router.post('/delete', deleteFunAtWork);
router.post('/deleteImage/:imageId', deleteSingleWorkImage);
router.post('/add', addFunAtWork);
router.post('/add/:imageId', addSingleFunAtWork);
router.get('/get', getFunAtWork);
router.get('/getSingle/:id', getSingleFunAtWork);
router.put('/update/v2', updateFullFunAtWork);

module.exports = router;
