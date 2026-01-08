const router = require('express').Router();

const addConnectorAgreement = require('../controllers/connectorAgreement/addConnectorAgreement');
const getConnectorAgreement = require('../controllers/connectorAgreement/getConnectorAgreement');

router.post('/add', addConnectorAgreement);
router.get('/get', getConnectorAgreement);

module.exports = router;
