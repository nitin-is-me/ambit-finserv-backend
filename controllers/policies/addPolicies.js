const Policies = require('../../model/policiesModel');
const {customErrorMessages} = require('../../utils/helpers');
const {policiesAddValidation} = require('../../validation/policiesValidation');

const addPolicy = async (req, res) => {
  try {
    await policiesAddValidation.validateAsync(req.body);
    const newPolicy = await Policies.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Policy added successfully',
      data: newPolicy,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addPolicy;
