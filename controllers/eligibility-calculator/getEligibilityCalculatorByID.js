const EligibilityCalculator = require('../../model/eligibilityCalculatorModel');
const {customErrorMessages} = require('../../utils/helpers');
const {
  eligibilityCalculatorGetByIdValidation,
} = require('../../validation/eligibilityCalculatorValidation');

const getEligibilityCalculatorByID = async (req, res) => {
  try {
    await eligibilityCalculatorGetByIdValidation.validateAsync(req.query);

    const {uniqueId} = req.query;

    const eligibilityCalculator = await EligibilityCalculator.findOne({
      uniqueID: uniqueId,
    }).select('-__v -otp'); // Exclude OTP from response

    if (!eligibilityCalculator) {
      return res.status(404).json({
        success: false,
        message: 'Eligibility calculation not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Eligibility calculation fetched successfully',
      data: eligibilityCalculator,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message});
  }
};

module.exports = getEligibilityCalculatorByID;
