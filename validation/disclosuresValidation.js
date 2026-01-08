const Joi = require('joi');

const disclosuresAddValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  upload_document: Joi.string().required(),
  year: Joi.number().required(),
});

const disclosuresUpdateValidation = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  type: Joi.string(),
  upload_document: Joi.string(),
  year: Joi.number(),
});

module.exports = {disclosuresAddValidation, disclosuresUpdateValidation};
