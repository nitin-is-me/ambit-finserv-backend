const Joi = require('joi');

const partnershipsAddValidation = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
  privacyPolicy: Joi.string().required(),
  grievance_officer_name: Joi.string().required(),
  grievance_officer_mobile: Joi.string().required(),
  grievance_officer_email: Joi.string().required(),
  grievance_officer_address: Joi.string().required(),
});

const partnershipsUpdateValidation = Joi.object({
  name: Joi.string(),
  image: Joi.string(),
  description: Joi.string(),
  privacyPolicy: Joi.string(),
  grievance_officer_name: Joi.string(),
  grievance_officer_mobile: Joi.string(),
  grievance_officer_email: Joi.string(),
  grievance_officer_address: Joi.string(),
});

module.exports = {
  partnershipsAddValidation,
  partnershipsUpdateValidation,
};
