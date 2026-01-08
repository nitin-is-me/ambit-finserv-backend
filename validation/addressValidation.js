const Joi = require('joi');

const addressAddValidation = Joi.object({
  address: Joi.string().required(),
  subAddress: Joi.string().required(),
  mobile: Joi.string(),
  email: Joi.string(),
});

const addressUpdateValidation = Joi.object({
  address: Joi.string(),
  subAddress: Joi.string(),
  mobile: Joi.string(),
  email: Joi.string(),
});

module.exports = {
  addressAddValidation,
  addressUpdateValidation,
};
