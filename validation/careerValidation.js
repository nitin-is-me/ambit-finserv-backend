const Joi = require('joi');

const CareerAddValidation = Joi.object({
  location: Joi.string().required(),
  state: Joi.string().required(),
  position: Joi.string().required(),
  product: Joi.string().required(),
  department: Joi.string().required(),
  education: Joi.string().required(),
  experience_required: Joi.string().required(),
  jd: Joi.string(),
  skill_set_required: Joi.string(),
});

const CareerUpdateValidation = Joi.object({
  location: Joi.string(),
  state: Joi.string(),
  position: Joi.string(),
  product: Joi.string(),
  department: Joi.string(),
  education: Joi.string(),
  experience_required: Joi.string(),
  jd: Joi.string(),
  skill_set_required: Joi.string(),
});

module.exports = {CareerAddValidation, CareerUpdateValidation};
