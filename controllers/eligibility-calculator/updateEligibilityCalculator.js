const {customErrorMessages} = require('../../utils/helpers');
const EligibilityCalculator = require('../../model/eligibilityCalculatorModel');

const updateEligibilityCalculator = async (req, res) => {
  try {
    const {uniqueID} = req.body;

    if (!uniqueID) {
      return res.status(400).json({
        success: false,
        message: 'Unique ID is required',
      });
    }

    // Find the eligibility calculator record
    const eligibilityCalculator = await EligibilityCalculator.findOne({
      uniqueID: uniqueID,
    });

    if (!eligibilityCalculator) {
      return res.status(404).json({
        success: false,
        message: 'Eligibility calculation not found',
      });
    }

    // Extract all possible fields from request body
    const {
      name,
      dob,
      phone_number,
      city,
      state,
      otp,
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

    // Update only the provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (dob !== undefined) updateData.dob = dob;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (otp !== undefined) {
      updateData.otp = otp;
      updateData.is_otp_verified = false; // Reset verification when OTP is updated
    }
    if (loan_type !== undefined) updateData.loan_type = loan_type;
    if (utm_source !== undefined) updateData.utm_source = utm_source;
    if (utm_medium !== undefined) updateData.utm_medium = utm_medium;
    if (utm_campaign !== undefined) updateData.utm_campaign = utm_campaign;
    if (businessVintage !== undefined)
      updateData.businessVintage = businessVintage;
    if (annualTurnover !== undefined)
      updateData.annualTurnover = annualTurnover;
    if (natureOfBusiness !== undefined)
      updateData.natureOfBusiness = natureOfBusiness;
    if (avgMonthlyBankBalance !== undefined)
      updateData.avgMonthlyBankBalance = avgMonthlyBankBalance;
    if (existingEmiObligations !== undefined)
      updateData.existingEmiObligations = existingEmiObligations;
    if (propertyType !== undefined) updateData.propertyType = propertyType;
    if (propertyValue !== undefined) updateData.propertyValue = propertyValue;
    if (eligibilityAmount !== undefined)
      updateData.eligibilityAmount = eligibilityAmount;
    if (eligibilityType !== undefined)
      updateData.eligibilityType = eligibilityType;
    if (calculationTimestamp !== undefined)
      updateData.calculationTimestamp = calculationTimestamp;
    if (userAge !== undefined) updateData.userAge = userAge;
    if (formSubmissionTimestamp !== undefined)
      updateData.formSubmissionTimestamp = formSubmissionTimestamp;
    if (sessionId !== undefined) updateData.sessionId = sessionId;

    // Update the eligibility calculation
    const updatedEligibility = await EligibilityCalculator.findOneAndUpdate(
      {uniqueID: uniqueID},
      updateData,
      {new: true, runValidators: true},
    );

    res.status(200).json({
      success: true,
      message: 'Eligibility calculation updated successfully',
      data: {
        id: updatedEligibility._id,
        lead_id: updatedEligibility.lead_id,
        token_id: updatedEligibility.token_id,
        uniqueID: updatedEligibility.uniqueID,
        name: updatedEligibility.name,
        dob: updatedEligibility.dob,
        phone_number: updatedEligibility.phone_number,
        city: updatedEligibility.city,
        state: updatedEligibility.state,
        loan_type: updatedEligibility.loan_type,
        utm_source: updatedEligibility.utm_source,
        utm_medium: updatedEligibility.utm_medium,
        utm_campaign: updatedEligibility.utm_campaign,
        businessVintage: updatedEligibility.businessVintage,
        annualTurnover: updatedEligibility.annualTurnover,
        natureOfBusiness: updatedEligibility.natureOfBusiness,
        avgMonthlyBankBalance: updatedEligibility.avgMonthlyBankBalance,
        existingEmiObligations: updatedEligibility.existingEmiObligations,
        propertyType: updatedEligibility.propertyType,
        propertyValue: updatedEligibility.propertyValue,
        eligibilityAmount: updatedEligibility.eligibilityAmount,
        eligibilityType: updatedEligibility.eligibilityType,
        calculationTimestamp: updatedEligibility.calculationTimestamp,
        userAge: updatedEligibility.userAge,
        formSubmissionTimestamp: updatedEligibility.formSubmissionTimestamp,
        sessionId: updatedEligibility.sessionId,
        is_otp_verified: updatedEligibility.is_otp_verified,
        calculated_at: updatedEligibility.calculated_at,
        created_at: updatedEligibility.createdAt,
        updated_at: updatedEligibility.updatedAt,
      },
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateEligibilityCalculator;
