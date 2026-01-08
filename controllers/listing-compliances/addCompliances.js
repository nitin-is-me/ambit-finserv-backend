const Compliances = require('../../model/compliancesModel');
const {customErrorMessages} = require('../../utils/helpers');
const {
  compliancesAddValidation,
} = require('../../validation/compliancesValidation');

const addCompliances = async (req, res) => {
  try {
    await compliancesAddValidation.validateAsync(req.body);
    const newCompliances = await Compliances.create(req.body);
    res.status(201).json({
      success: true,
      message: 'listing compliances added successfully',
      data: newCompliances,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addCompliances;
