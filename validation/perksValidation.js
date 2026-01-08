const Joi = require('joi');

const PerksAddValidation = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().required(),
  description: Joi.string().required(),
});

const PerksUpdateValidation = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
});

module.exports = {PerksAddValidation, PerksUpdateValidation};
