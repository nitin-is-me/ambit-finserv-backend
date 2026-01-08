const router = require('express').Router();
const addJourney = require('../controllers/ourJourney/addJourney');
const updateJourney = require('../controllers/ourJourney/updateJourney');
const deleteJourney = require('../controllers/ourJourney/deleteJourney');
const getJourney = require('../controllers/ourJourney/getJourney');

router.post('/add', addJourney);
router.put('/update', updateJourney);
router.post('/delete', deleteJourney);
router.get('/get', getJourney);
module.exports = router;
