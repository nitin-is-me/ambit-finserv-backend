const Joi = require('joi');

const AddLoansValidation = Joi.object({
  overview: Joi.object({
    title: Joi.string().required(),
    count: Joi.number().required(),
  }).required(),
  features: Joi.array()
    .items(
      Joi.object({
        icon: Joi.string().required(),
        feature_name: Joi.string().required(),
      }),
    )
    .required(),
  eligibility: Joi.array()
    .items(
      Joi.object({
        criteria: Joi.string().required(),
        requirement: Joi.string().required(),
      }),
    )
    .required(),
  required_documents: Joi.array()
    .items(
      Joi.object({
        icon: Joi.string().required(),
        document_name: Joi.string().required(),
      }),
    )
    .required(),
  loan_type: Joi.string()
    .valid('Udyam Loan', 'Vyapar Loan', 'Parivahan Loan')
    .required(),
});

const UpdateLoansValidation = Joi.object({
  overview: Joi.object({
    title: Joi.string().required(),
    count: Joi.number().required(),
  }).required(),
  features: Joi.array()
    .items(
      Joi.object({
        icon: Joi.string().required(),
        feature_name: Joi.string().required(),
      }),
    )
    .required(),
  eligibility: Joi.array()
    .items(
      Joi.object({
        criteria: Joi.string().required(),
        requirement: Joi.string().required(),
      }),
    )
    .required(),
  required_documents: Joi.array()
    .items(
      Joi.object({
        icon: Joi.string().required(),
        document_name: Joi.string().required(),
      }),
    )
    .required(),
  loan_type: Joi.string()
    .valid('Udyam Loan', 'Vyapar Loan', 'Parivahan Loan')
    .required(),
});

module.exports = {AddLoansValidation, UpdateLoansValidation};
