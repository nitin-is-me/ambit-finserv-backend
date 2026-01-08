const LoansModel = require('../../model/loansModel');
const {customErrorMessages} = require('../../utils/helpers');
const {AddLoansValidation} = require('../../validation/loanValidation');

const addLoan = async (req, res) => {
  try {
    await AddLoansValidation.validateAsync(req.body);
    const newLoan = await LoansModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Loan added successfully',
      data: newLoan,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addLoan;
