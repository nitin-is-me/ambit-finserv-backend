const Joi = require('joi');

const MediaContactsAddValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string().required(),
  mobile_number: Joi.number().required(),
  designation: Joi.string().required(),
});

const MediaContactsUpdateValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  address: Joi.string(),
  mobile_number: Joi.number(),
  designation: Joi.string(),
});

module.exports = {MediaContactsAddValidation, MediaContactsUpdateValidation};
