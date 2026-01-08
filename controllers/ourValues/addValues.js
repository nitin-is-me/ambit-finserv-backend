const OurValues = require('../../model/ourValuesModel');
const {customErrorMessages} = require('../../utils/helpers');
const {
  addOurValuesValidation,
} = require('../../validation/ourValuesValidation');

const addValues = async (req, res) => {
  try {
    await addOurValuesValidation.validateAsync(req.body);
    const newOurValues = await OurValues.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Our Values added successfully',
      data: newOurValues,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addValues;
