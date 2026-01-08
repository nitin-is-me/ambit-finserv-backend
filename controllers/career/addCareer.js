const CareerModel = require('../../model/careerModel');
const {customErrorMessages} = require('../../utils/helpers');
const {CareerAddValidation} = require('../../validation/careerValidation');

const addCareer = async (req, res) => {
  try {
    await CareerAddValidation.validateAsync(req.body);
    const newCareer = await CareerModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Career added successfully',
      data: newCareer,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addCareer;
