const EligibilityCalculator = require('../../model/eligibilityCalculatorModel');
const {customErrorMessages} = require('../../utils/helpers');

const checkEligibilityCalculator = async (req, res) => {
  try {
    const {phone_number, otp} = req.body;

    if (!phone_number || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
      });
    }

    const existingEligibility = await EligibilityCalculator.findOne({
      phone_number: phone_number,
    });

    if (!existingEligibility) {
      return res.status(404).json({
        success: false,
        message: 'No eligibility calculation found with this phone number',
      });
    }

    // Verify OTP
    if (existingEligibility.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Update OTP verification status
    existingEligibility.is_otp_verified = true;
    await existingEligibility.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        id: existingEligibility._id,
        lead_id: existingEligibility.lead_id,
        token_id: existingEligibility.token_id,
        uniqueID: existingEligibility.uniqueID,
        name: existingEligibility.name,
        dob: existingEligibility.dob,
        phone_number: existingEligibility.phone_number,
        city: existingEligibility.city,
        state: existingEligibility.state,
        loan_type: existingEligibility.loan_type,
        utm_source: existingEligibility.utm_source,
        utm_medium: existingEligibility.utm_medium,
        utm_campaign: existingEligibility.utm_campaign,
        businessVintage: existingEligibility.businessVintage,
        annualTurnover: existingEligibility.annualTurnover,
        natureOfBusiness: existingEligibility.natureOfBusiness,
        avgMonthlyBankBalance: existingEligibility.avgMonthlyBankBalance,
        existingEmiObligations: existingEligibility.existingEmiObligations,
        propertyType: existingEligibility.propertyType,
        propertyValue: existingEligibility.propertyValue,
        eligibilityAmount: existingEligibility.eligibilityAmount,
        eligibilityType: existingEligibility.eligibilityType,
        calculationTimestamp: existingEligibility.calculationTimestamp,
        userAge: existingEligibility.userAge,
        formSubmissionTimestamp: existingEligibility.formSubmissionTimestamp,
        sessionId: existingEligibility.sessionId,
        is_otp_verified: existingEligibility.is_otp_verified,
        calculated_at: existingEligibility.calculated_at,
        created_at: existingEligibility.createdAt,
        updated_at: existingEligibility.updatedAt,
      },
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = checkEligibilityCalculator;
