const {customErrorMessages} = require('../../utils/helpers');
const NachMandate = require('../../model/nachMandateModel');
const {
  nachMandateAddValidation,
} = require('../../validation/nachMandateValidation');

const addNachMandate = async (req, res) => {
  try {
    await nachMandateAddValidation.validateAsync(req.body);
    const nachMandate = await NachMandate.create(req.body);

    res.status(201).json({
      success: true,
      message: 'NachMandate added successfully',
      data: nachMandate,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addNachMandate;
