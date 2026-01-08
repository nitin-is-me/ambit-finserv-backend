const router = require('express').Router();
const signUp = require('../controllers/user/signUp');
const login = require('../controllers/user/login');
const updateProfile = require('../controllers/user/updateProfile');
const changePassword = require('../controllers/user/changePassword');
const authRole = require('../middleware/authRole');

router.post('/signUp', signUp);
router.post('/login', login);
router.post('/changePassword', authRole(), changePassword);
router.post('/updateProfile', authRole(), updateProfile);

module.exports = router;
