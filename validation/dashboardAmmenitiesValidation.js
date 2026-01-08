const Joi = require('joi');

const addDashboardAmenitiesValidation = Joi.object({
  statistics: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        count: Joi.number().required(),
      }),
    )
    .required(),
  dashboard_description: Joi.string().required(),
  loans: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .valid('Udyam Loan', 'Vyapar Loan', 'Parivahan Loan')
          .required(),
        title: Joi.string().required(),
        icon: Joi.string().required(),
        loan_description: Joi.string().required(),
      }),
    )
    .required(),
});

const updateDashboardAmenitiesValidation = Joi.object({
  statistics: Joi.array().items(
    Joi.object({
      title: Joi.string(),
      count: Joi.number(),
    }),
  ),
  dashboard_description: Joi.string(),
  loans: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().valid('Udyam Loan', 'Vyapar Loan', 'Parivahan Loan'),
        title: Joi.string(),
        icon: Joi.string(),
        loan_description: Joi.string(),
      }),
    )
    .required(),
});

module.exports = {
  addDashboardAmenitiesValidation,
  updateDashboardAmenitiesValidation,
};
