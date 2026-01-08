const Joi = require('joi');

const funAtWorkAddValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.array().items(
    Joi.object({
      url: Joi.string().required(),
      description: Joi.string().required(),
    }),
  ),
});

const funAtWorkFullCardUpdateValidation = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
});

const funAtWorkImageUpdateValidation = Joi.object({
  image: Joi.array().items(
    Joi.object({
      url: Joi.string(),
      description: Joi.string(),
    }),
  ),
});

module.exports = {
  funAtWorkAddValidation,
  funAtWorkFullCardUpdateValidation,
  funAtWorkImageUpdateValidation,
};
