const express = require('express');
const router = express.Router();

// Import controllers
const addTeleCaller = require('../controllers/tele-caller/addTeleCaller');
const getTeleCaller = require('../controllers/tele-caller/getTeleCaller');
const getTeleCallerByID = require('../controllers/tele-caller/getTeleCallerByID');
const updateTeleCaller = require('../controllers/tele-caller/updateTeleCaller');
const deleteTeleCaller = require('../controllers/tele-caller/deleteTeleCaller');

// Routes
router.post('/add', addTeleCaller);
router.get('/get', getTeleCaller);
router.get('/get/:id', getTeleCallerByID);
router.put('/update/:id', updateTeleCaller);
router.delete('/delete/:id', deleteTeleCaller);

module.exports = router;
