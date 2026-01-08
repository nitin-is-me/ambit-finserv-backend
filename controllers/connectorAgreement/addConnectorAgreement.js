const {customErrorMessages} = require('../../utils/helpers');
const ConnectorAgreement = require('../../model/connectorAgreement');

const addConnectorAgreement = async (req, res) => {
  try {
    const existing = await ConnectorAgreement.findOne({
      mobile: req.body.mobile,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Mobile Number already registered',
      });
    }
    // check loan details with loan account number

    const agreement = await ConnectorAgreement.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Connector added successfully',
      data: agreement,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addConnectorAgreement;
