const {customErrorMessages} = require('../../utils/helpers');
const LoanType = require('../../model/loanTypeModel');

const addLoanType = async (req, res) => {
  try {
    const newLoan = await LoanType.create(req.body);
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

module.exports = addLoanType;
