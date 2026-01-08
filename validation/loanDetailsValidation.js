const Joi = require('joi');

const loanDetailsAddValidation = Joi.object({
  loan_account_number: Joi.string().required(),
  customer_name: Joi.string().required(),
  registered_mobile: Joi.string().required(),
  registered_email: Joi.string().required(),
  installment_amount: Joi.string().required(),
  sanction_amount: Joi.string().required(),
  umrn: Joi.string().required(),
});

const loanDetailsUpdateValidation = Joi.object({
  loan_account_number: Joi.string(),
  customer_name: Joi.string(),
  registered_mobile: Joi.string(),
  registered_email: Joi.string(),
  installment_amount: Joi.string(),
  sanction_amount: Joi.string(),
  umrn: Joi.string(),
});

module.exports = {
  loanDetailsAddValidation,
  loanDetailsUpdateValidation,
};
