const Joi = require('joi');

const jobResumeAddValidation = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  mobile_number: Joi.string().required(),
  current_location: Joi.string().required(),
  state: Joi.string().required(),
  preferred_location: Joi.string().required(),
  resume: Joi.string().required(),
  department: Joi.string(),
  product: Joi.string(),
  branch: Joi.string(),
  type_of_resume: Joi.string(),
  position: Joi.string(),
});

const jobResumeUpdateValidation = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string(),
  mobile_number: Joi.string(),
  current_location: Joi.string(),
  state: Joi.string(),
  preferred_location: Joi.string(),
  resume: Joi.string(),
  department: Joi.string(),
  product: Joi.string(),
  branch: Joi.string(),
  type_of_resume: Joi.string(),
  position: Joi.string(),
});

module.exports = {jobResumeAddValidation, jobResumeUpdateValidation};
