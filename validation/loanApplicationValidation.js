const Joi = require('joi');

const loanApplicationAddValidation = Joi.object({
  lead_id: Joi.string().allow('', null).optional(),
  first_name: Joi.string(),
  middle_name: Joi.string(),
  uniqueID: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string(),
  dob: Joi.string()
    .custom((value, helpers) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime()))
        return helpers.message('Invalid date of birth');
      const age = Math.floor(
        (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      );
      if (age < 21 || age > 60)
        return helpers.message('Age must be between 21 and 60');
      return value;
    })
    .allow('', null),
  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message('Mobile number must be 10 digits'),
  pan_number: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .message('PAN number must be in format AAAAA9999A')
    .allow('', null),
  aadhar_number: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .message('Aadhar number must be 12 digits')
    .allow('', null),
  dl_number: Joi.string()
    .pattern(/^[A-Z]{2}\d{13}$/)
    .message('DL number must match pattern ^[A-Z]{2}\\d{13}$')
    .allow('', null),
  pin_code: Joi.string()
    .pattern(/^\d{6}$/)
    .message('Pin code must be 6 digits')
    .allow('', null),
  city_name: Joi.string(),
  state_name: Joi.string(),
  loan_amount: Joi.string()
    .pattern(/^\d+$/)
    .message('Loan amount must be numeric')
    .custom((value, helpers) => {
      const amt = parseInt(value, 10);
      if (Number.isNaN(amt))
        return helpers.message('Loan amount must be numeric');
      if (amt < 300000 || amt > 30000000)
        return helpers.message(
          'Loan amount must be between 300000 and 30000000',
        );
      return value;
    }),
  loan_duration: Joi.string(),
  resident_ownership: Joi.string(),
  customer_profile: Joi.string(),
  business_name: Joi.string(),
  business_pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .message('Business pin code must be 6 digits')
    .allow('', null),
  last_twelve_month_sales: Joi.string(),
  constitution: Joi.string(),
  number_of_years_in_business: Joi.string(),
  business_annual_turnover: Joi.string(),
  loan_type: Joi.string(),
  utm_source: Joi.string(),
  utm_campaign: Joi.string(),
  utm_medium: Joi.string(),
  income: Joi.string(),
  ownership_proof: Joi.string(),
  is_gst_registered: Joi.string(),
});

const loanApplicationUpdateValidation = Joi.object({
  lead_id: Joi.string().allow('', null).optional(),
  first_name: Joi.string(),
  uniqueID: Joi.string(),
  middle_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string(),
  dob: Joi.string()
    .custom((value, helpers) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime()))
        return helpers.message('Invalid date of birth');
      const age = Math.floor(
        (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      );
      if (age < 21 || age > 60)
        return helpers.message('Age must be between 21 and 60');
      return value;
    })
    .allow('', null),
  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message('Mobile number must be 10 digits'),
  pan_number: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .message('PAN number must be in format AAAAA9999A')
    .allow('', null),
  aadhar_number: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .message('Aadhar number must be 12 digits')
    .allow('', null),
  dl_number: Joi.string()
    .pattern(/^[A-Z]{2}\d{13}$/)
    .message('DL number must match pattern ^[A-Z]{2}\\d{13}$')
    .allow('', null),
  pin_code: Joi.string()
    .pattern(/^\d{6}$/)
    .message('Pin code must be 6 digits')
    .allow('', null),
  city_name: Joi.string(),
  state_name: Joi.string(),
  loan_amount: Joi.string()
    .pattern(/^\d+$/)
    .message('Loan amount must be numeric')
    .custom((value, helpers) => {
      const amt = parseInt(value, 10);
      if (Number.isNaN(amt))
        return helpers.message('Loan amount must be numeric');
      if (amt < 300000 || amt > 30000000)
        return helpers.message(
          'Loan amount must be between 300000 and 30000000',
        );
      return value;
    }),
  loan_duration: Joi.string(),
  resident_ownership: Joi.string(),
  customer_profile: Joi.string(),
  business_name: Joi.string(),
  business_pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .message('Business pin code must be 6 digits')
    .allow('', null),
  last_twelve_month_sales: Joi.string(),
  constitution: Joi.string(),
  number_of_years_in_business: Joi.string(),
  business_annual_turnover: Joi.string(),
  loan_type: Joi.string(),
  utm_source: Joi.string(),
  utm_campaign: Joi.string(),
  utm_medium: Joi.string(),
  income: Joi.string(),
  ownership_proof: Joi.string(),
  is_gst_registered: Joi.string(),
});

module.exports = {
  loanApplicationAddValidation,
  loanApplicationUpdateValidation,
};
