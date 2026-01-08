const LoansModel = require('../../model/loansModel');
const {customErrorMessages} = require('../../utils/helpers');

const getLoans = async (req, res) => {
  try {
    const loans = await LoansModel.find({});
    res.status(200).json({
      success: true,
      message: 'Loans fetched successfully',
      data: loans,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getLoans;
