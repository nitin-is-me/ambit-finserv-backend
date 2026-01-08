const Joi = require('joi');

const addOurValuesValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

const updateOurValuesValidation = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
});

module.exports = {addOurValuesValidation, updateOurValuesValidation};
