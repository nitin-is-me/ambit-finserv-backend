const Joi = require('joi');

const journeyValidation = Joi.object({
  year: Joi.number().required(),
  description: Joi.string().required(),
});

module.exports = {journeyValidation};
