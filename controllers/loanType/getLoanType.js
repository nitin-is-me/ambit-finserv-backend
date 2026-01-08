const {customErrorMessages} = require('../../utils/helpers');
const LoanType = require('../../model/loanTypeModel');

const getLoanType = async (req, res) => {
  try {
    const loan = await LoanType.find();
    res.status(201).json({
      success: true,
      message: 'Loan fetched successfully',
      data: loan,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getLoanType;
