const Joi = require('joi');

const teleCallerAddValidation = Joi.object({
  mobile_number: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Mobile number must be a valid 10-digit Indian mobile number',
      'any.required': 'Mobile number is required',
    }),
  disposition: Joi.string().required().messages({
    'any.required': 'Disposition is required',
  }),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Date must be in YYYY-MM-DD format',
      'any.required': 'Date is required',
    }),
  time: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'Time must be in HH:MM format (24-hour)',
      'any.required': 'Time is required',
    }),
  type: Joi.string().valid('call', 'facebook').default('call').messages({
    'any.only': 'Type must be either "call" or "facebook"',
  }),
});

const teleCallerUpdateValidation = Joi.object({
  mobile_number: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      'string.pattern.base':
        'Mobile number must be a valid 10-digit Indian mobile number',
    }),
  disposition: Joi.string(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      'string.pattern.base': 'Date must be in YYYY-MM-DD format',
    }),
  time: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      'string.pattern.base': 'Time must be in HH:MM format (24-hour)',
    }),
  type: Joi.string().valid('call', 'facebook').messages({
    'any.only': 'Type must be either "call" or "facebook"',
  }),
});

const teleCallerGetValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  mobile_number: Joi.string().pattern(/^[6-9]\d{9}$/),
  type: Joi.string().valid('call', 'facebook'),
  date_from: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  date_to: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  disposition: Joi.string(),
  search: Joi.string().allow(''),
});

module.exports = {
  teleCallerAddValidation,
  teleCallerUpdateValidation,
  teleCallerGetValidation,
};
