const Joi = require('joi');

const policiesAddValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  upload_document: Joi.string().required(),
  year: Joi.number().required(),
});

const policiesUpdateValidation = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  upload_document: Joi.string(),
  year: Joi.number(),
});

module.exports = {policiesAddValidation, policiesUpdateValidation};
