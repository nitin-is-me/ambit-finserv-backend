const Joi = require('joi');

const testimonialValidation = Joi.object({
  title: Joi.string().required(),
  stars: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.string().required(),
});

module.exports = {testimonialValidation};
