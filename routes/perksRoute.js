const router = require('express').Router();

const addPerks = require('../controllers/perks/addPerks');
const getPerks = require('../controllers/perks/getperks');
const updatePerks = require('../controllers/perks/updatePerks');
const deletePerks = require('../controllers/perks/deletePerks');

router.put('/update', updatePerks);
router.post('/delete', deletePerks);
router.post('/add', addPerks);
router.get('/get', getPerks);

module.exports = router;
