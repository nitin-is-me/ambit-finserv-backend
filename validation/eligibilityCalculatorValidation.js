const Joi = require('joi');

const eligibilityCalculatorAddValidation = Joi.object({
  lead_id: Joi.string().allow(''),
  token_id: Joi.string().allow(''),
  uniqueID: Joi.string().allow(''),

  // Required fields
  name: Joi.string().required(),
  dob: Joi.string().required(),
  phone_number: Joi.string().required(),
  otp: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),

  // Existing optional fields
  loan_type: Joi.string().allow(''),
  utm_source: Joi.string().allow(''),
  utm_medium: Joi.string().allow(''),
  utm_campaign: Joi.string().allow(''),

  // New calculator fields
  businessVintage: Joi.number().allow(''),
  annualTurnover: Joi.number().allow(''),
  natureOfBusiness: Joi.string().allow(''),
  avgMonthlyBankBalance: Joi.number().allow(''),
  existingEmiObligations: Joi.number().allow(''),
  propertyType: Joi.string().allow(''),
  propertyValue: Joi.number().allow(''),
  eligibilityAmount: Joi.number().allow(''),
  eligibilityType: Joi.string().allow(''),
  calculationTimestamp: Joi.date().allow(''),
  userAge: Joi.number().allow(''),
  formSubmissionTimestamp: Joi.date().allow(''),
  sessionId: Joi.string().allow(''),

  // Legacy fields (keeping for backward compatibility)
  first_name: Joi.string().allow(''),
  middle_name: Joi.string().allow(''),
  last_name: Joi.string().allow(''),
  email: Joi.string().allow(''),
  mobile_number: Joi.string().allow(''),
  pan_number: Joi.string().allow(''),
  aadhar_number: Joi.string().allow(''),
  pin_code: Joi.string().allow(''),
  city_name: Joi.string().allow(''),
  state_name: Joi.string().allow(''),
  loan_amount: Joi.any().allow(''),
  loan_duration: Joi.any().allow(''),
  resident_ownership: Joi.string().allow(''),
  customer_profile: Joi.string().allow(''),
  business_name: Joi.string().allow(''),
  business_pincode: Joi.string().allow(''),
  last_twelve_month_sales: Joi.any().allow(''),
  constitution: Joi.string().allow(''),
  number_of_years_in_business: Joi.any().allow(''),
  business_annual_turnover: Joi.any().allow(''),
  income: Joi.any().allow(''),
  ownership_proof: Joi.string().allow(''),
  is_gst_registered: Joi.string().allow(''),
  credit_score: Joi.number().allow(''),
  monthly_income: Joi.number().allow(''),
  monthly_expenses: Joi.number().allow(''),
  existing_loans: Joi.number().allow(''),
  loan_emi: Joi.number().allow(''),
  employment_type: Joi.string().allow(''),
  company_name: Joi.string().allow(''),
  job_title: Joi.string().allow(''),
  work_experience: Joi.number().allow(''),
});

const eligibilityCalculatorUpdateValidation = Joi.object({
  lead_id: Joi.string().allow(''),
  token_id: Joi.string().allow(''),
  uniqueID: Joi.string().allow(''),

  // Required fields (optional for update)
  name: Joi.string().allow(''),
  dob: Joi.string().allow(''),
  phone_number: Joi.string().allow(''),
  otp: Joi.string().allow(''),
  city: Joi.string().allow(''),
  state: Joi.string().allow(''),

  // Existing optional fields
  loan_type: Joi.string().allow(''),
  utm_source: Joi.string().allow(''),
  utm_medium: Joi.string().allow(''),
  utm_campaign: Joi.string().allow(''),

  // New calculator fields
  businessVintage: Joi.number().allow(''),
  annualTurnover: Joi.number().allow(''),
  natureOfBusiness: Joi.string().allow(''),
  avgMonthlyBankBalance: Joi.number().allow(''),
  existingEmiObligations: Joi.number().allow(''),
  propertyType: Joi.string().allow(''),
  propertyValue: Joi.number().allow(''),
  eligibilityAmount: Joi.number().allow(''),
  eligibilityType: Joi.string().allow(''),
  calculationTimestamp: Joi.date().allow(''),
  userAge: Joi.number().allow(''),
  formSubmissionTimestamp: Joi.date().allow(''),
  sessionId: Joi.string().allow(''),

  // Legacy fields (keeping for backward compatibility)
  first_name: Joi.string().allow(''),
  middle_name: Joi.string().allow(''),
  last_name: Joi.string().allow(''),
  email: Joi.string().allow(''),
  mobile_number: Joi.string().allow(''),
  pan_number: Joi.string().allow(''),
  aadhar_number: Joi.string().allow(''),
  pin_code: Joi.string().allow(''),
  city_name: Joi.string().allow(''),
  state_name: Joi.string().allow(''),
  loan_amount: Joi.any().allow(''),
  loan_duration: Joi.any().allow(''),
  resident_ownership: Joi.string().allow(''),
  customer_profile: Joi.string().allow(''),
  business_name: Joi.string().allow(''),
  business_pincode: Joi.string().allow(''),
  last_twelve_month_sales: Joi.any().allow(''),
  constitution: Joi.string().allow(''),
  number_of_years_in_business: Joi.any().allow(''),
  business_annual_turnover: Joi.any().allow(''),
  income: Joi.any().allow(''),
  ownership_proof: Joi.string().allow(''),
  is_gst_registered: Joi.string().allow(''),
  credit_score: Joi.number().allow(''),
  monthly_income: Joi.number().allow(''),
  monthly_expenses: Joi.number().allow(''),
  existing_loans: Joi.number().allow(''),
  loan_emi: Joi.number().allow(''),
  employment_type: Joi.string().allow(''),
  company_name: Joi.string().allow(''),
  job_title: Joi.string().allow(''),
  work_experience: Joi.number().allow(''),
});

const eligibilityCalculatorCheckValidation = Joi.object({
  phone_number: Joi.string().allow(''),
  mobile_number: Joi.string().allow(''), // Legacy support
});

const eligibilityCalculatorGetByIdValidation = Joi.object({
  uniqueId: Joi.string().allow(''),
});

const eligibilityCalculatorDeleteValidation = Joi.object({
  id: Joi.string().allow(''),
});

module.exports = {
  eligibilityCalculatorAddValidation,
  eligibilityCalculatorUpdateValidation,
  eligibilityCalculatorCheckValidation,
  eligibilityCalculatorGetByIdValidation,
  eligibilityCalculatorDeleteValidation,
};
