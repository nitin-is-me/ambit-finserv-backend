const Joi = require('joi');

const blogAddValidation = Joi.object({
  image: Joi.string().required(),
  title: Joi.string().required(),
  date: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
});

const blogUpdateValidation = Joi.object({
  image: Joi.string(),
  title: Joi.string(),
  date: Joi.string(),
  description: Joi.string(),
  category: Joi.string(),
});

module.exports = {blogAddValidation, blogUpdateValidation};
