const EligibilityCalculator = require('../../model/eligibilityCalculatorModel');
const {customErrorMessages} = require('../../utils/helpers');

const addEligibilityCalculator = async (req, res) => {
  try {
    // Validate required fields
    const {name, dob, phone_number, otp, city, state} = req.body;

    if (!name || !dob || !phone_number || !otp || !city || !state) {
      return res.status(400).json({
        success: false,
        message:
          'All fields are required: name, dob, phone_number, otp, city, state',
      });
    }

    // Check if eligibility calculation already exists for this phone number
    const existingEligibility = await EligibilityCalculator.findOne({
      phone_number: phone_number,
    });

    if (existingEligibility) {
      return res.status(409).json({
        success: false,
        message: 'Eligibility calculation already exists for this phone number',
        data: {
          id: existingEligibility._id,
          lead_id: existingEligibility.lead_id,
          uniqueID: existingEligibility.uniqueID,
        },
      });
    }

    // Extract all fields from request body
    const {
      loan_type,
      utm_source,
      utm_medium,
      utm_campaign,
      businessVintage,
      annualTurnover,
      natureOfBusiness,
      avgMonthlyBankBalance,
      existingEmiObligations,
      propertyType,
      propertyValue,
      eligibilityAmount,
      eligibilityType,
      calculationTimestamp,
      userAge,
      formSubmissionTimestamp,
      sessionId,
    } = req.body;

    // Create eligibility calculation record with all provided data
    const eligibilityData = {
      name,
      dob,
      phone_number,
      otp,
      city,
      state,
      is_otp_verified: req.body.is_otp_verified || false,

      // Optional fields
      loan_type,
      utm_source,
      utm_medium,
      utm_campaign,
      businessVintage,
      annualTurnover,
      natureOfBusiness,
      avgMonthlyBankBalance,
      existingEmiObligations,
      propertyType,
      propertyValue,
      eligibilityAmount,
      eligibilityType,
      calculationTimestamp,
      userAge,
      formSubmissionTimestamp,
      sessionId,
    };

    const newEligibility = await EligibilityCalculator.create(eligibilityData);

    res.status(201).json({
      success: true,
      message: 'Eligibility calculation record created successfully',
      data: {
        id: newEligibility._id,
        lead_id: newEligibility.lead_id,
        token_id: newEligibility.token_id,
        uniqueID: newEligibility.uniqueID,
        name: newEligibility.name,
        dob: newEligibility.dob,
        phone_number: newEligibility.phone_number,
        city: newEligibility.city,
        state: newEligibility.state,
        loan_type: newEligibility.loan_type,
        utm_source: newEligibility.utm_source,
        utm_medium: newEligibility.utm_medium,
        utm_campaign: newEligibility.utm_campaign,
        businessVintage: newEligibility.businessVintage,
        annualTurnover: newEligibility.annualTurnover,
        natureOfBusiness: newEligibility.natureOfBusiness,
        avgMonthlyBankBalance: newEligibility.avgMonthlyBankBalance,
        existingEmiObligations: newEligibility.existingEmiObligations,
        propertyType: newEligibility.propertyType,
        propertyValue: newEligibility.propertyValue,
        eligibilityAmount: newEligibility.eligibilityAmount,
        eligibilityType: newEligibility.eligibilityType,
        calculationTimestamp: newEligibility.calculationTimestamp,
        userAge: newEligibility.userAge,
        formSubmissionTimestamp: newEligibility.formSubmissionTimestamp,
        sessionId: newEligibility.sessionId,
        is_otp_verified: newEligibility.is_otp_verified,
        calculated_at: newEligibility.calculated_at,
        created_at: newEligibility.createdAt,
        updated_at: newEligibility.updatedAt,
      },
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addEligibilityCalculator;
