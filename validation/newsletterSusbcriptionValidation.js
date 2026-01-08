const Joi = require('joi');

const newsletterSubscriptionAddValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
  }),
});

const newsletterSubscriptionUpdateValidation = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address',
  }),
});

module.exports = {
  newsletterSubscriptionAddValidation,
  newsletterSubscriptionUpdateValidation,
};
