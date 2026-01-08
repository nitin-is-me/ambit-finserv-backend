const Joi = require('joi');

const nachMandateAddValidation = Joi.object({
  loan_account_number: Joi.string().required(),
  registered_mobile: Joi.string().required(),
  type_of_request: Joi.string().required(),
});

const nachMandateUpdateValidation = Joi.object({
  loan_account_number: Joi.string(),
  registered_mobile: Joi.string(),
  type_of_request: Joi.string(),
});

module.exports = {
  nachMandateAddValidation,
  nachMandateUpdateValidation,
};
