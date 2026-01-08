const Joi = require('joi');

const branchAddressAddValidation = Joi.object({
  branch_location: Joi.string().required(),
  state: Joi.string().required(),
  branch_address: Joi.string().required(),
});

const branchAddressUpdateValidation = Joi.object({
  branch_location: Joi.string(),
  state: Joi.string(),
  branch_address: Joi.string(),
});

module.exports = {
  branchAddressAddValidation,
  branchAddressUpdateValidation,
};
