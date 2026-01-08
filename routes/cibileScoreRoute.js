const router = require('express').Router();
const addCibilUser = require('../controllers/cibil-score/createCibilUser');
const getCibilUsers = require('../controllers/cibil-score/getCibilScoreUser');
const checkExistingCibilUser = require('../controllers/cibil-score/checkExistingCibilUser');
const updateCibilUser = require('../controllers/cibil-score/updateCibilUser');
const cibilApiLogger = require('../middleware/cibilApiLogger');

// Apply logging middleware to all CIBIL routes
router.use(cibilApiLogger);

router.post('/add', addCibilUser);
router.get('/get', getCibilUsers);
router.post('/check-existing', checkExistingCibilUser);
router.put('/update', updateCibilUser);

module.exports = router;
