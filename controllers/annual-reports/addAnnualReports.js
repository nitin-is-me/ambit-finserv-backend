const AnnualReports = require('../../model/annualReportsModel');
const {customErrorMessages} = require('../../utils/helpers');
const {
  annualReportsAddValidation,
} = require('../../validation/annualReportsValidation');

const addAnnualReports = async (req, res) => {
  try {
    await annualReportsAddValidation.validateAsync(req.body);
    const newAnnualReports = await AnnualReports.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Annual reports added successfully',
      data: newAnnualReports,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addAnnualReports;
