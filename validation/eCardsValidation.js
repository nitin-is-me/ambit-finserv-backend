const Joi = require('joi');

const ECardsAddValidation = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  mobile: Joi.string().required(),
  email: Joi.string().required(),
  dob: Joi.string().required(),
  city: Joi.string().required(),
  pincode: Joi.string().required(),
  state: Joi.string().required(),
  loan_type: Joi.string().required(),
});

const ECardsUpdateValidation = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  mobile: Joi.string(),
  email: Joi.string(),
  dob: Joi.string(),
  city: Joi.string(),
  pincode: Joi.string(),
  state: Joi.string(),
  loan_type: Joi.string(),
});

module.exports = {ECardsAddValidation, ECardsUpdateValidation};
