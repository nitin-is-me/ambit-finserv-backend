const Joi = require('joi');

const faqAddValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

const faqUpdateValidation = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
});

module.exports = {
  faqAddValidation,
  faqUpdateValidation,
};
