const {customErrorMessages} = require('../../utils/helpers');
const EligibilityCalculator = require('../../model/eligibilityCalculatorModel');
const {
  eligibilityCalculatorDeleteValidation,
} = require('../../validation/eligibilityCalculatorValidation');

const deleteEligibilityCalculator = async (req, res) => {
  try {
    await eligibilityCalculatorDeleteValidation.validateAsync(req.body);

    const {id} = req.body;

    const eligibilityCalculator =
      await EligibilityCalculator.findByIdAndDelete(id);

    if (!eligibilityCalculator) {
      return res.status(404).json({
        success: false,
        message: 'Eligibility calculation not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Eligibility calculation deleted successfully',
      data: {
        id: eligibilityCalculator._id,
        lead_id: eligibilityCalculator.lead_id,
        uniqueID: eligibilityCalculator.uniqueID,
        name: eligibilityCalculator.name,
        phone_number: eligibilityCalculator.phone_number,
        deleted_at: new Date(),
      },
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteEligibilityCalculator;
