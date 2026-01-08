const Joi = require('joi');

const awardsAddValidation = Joi.object({
  image: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
});

const awardsUpdateValidation = Joi.object({
  image: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
});

module.exports = {
  awardsAddValidation,
  awardsUpdateValidation,
};
