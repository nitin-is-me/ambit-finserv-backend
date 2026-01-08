const OurValues = require('../../model/ourValuesModel');
const {customErrorMessages} = require('../../utils/helpers');
const {
  updateOurValuesValidation,
} = require('../../validation/ourValuesValidation');

const updateValues = async (req, res) => {
  try {
    const {id} = req.params;
    await updateOurValuesValidation.validateAsync(req.body);
    const updatedOurValues = await OurValues.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json({
      success: true,
      message: 'Our Values updated successfully',
      data: updatedOurValues,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateValues;
