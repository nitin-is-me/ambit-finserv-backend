const Joi = require('joi');

const userValidation = Joi.object({
  fullname: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  image: Joi.string(),
  role: Joi.string(),
  // role: Joi.string().valid('admin', 'eauction_user', 'regulatory_user'),
});

const updateProfileValidation = Joi.object({
  fullname: Joi.string(),
  image: Joi.string(),
});

const changePasswordValidation = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
});

module.exports = {
  userValidation,
  updateProfileValidation,
  changePasswordValidation,
};
