const Joi = require('joi');

const leadershipValidation = Joi.object({
  name: Joi.string(),
  image: Joi.string().required(),
  description: Joi.string(),
  designation: Joi.string(),
});

module.exports = {leadershipValidation};
