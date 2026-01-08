const {customErrorMessages} = require('../../utils/helpers');
const LoansModel = require('../../model/loansModel');

const deleteLoan = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const loan = await LoansModel.findByIdAndDelete(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Loan deleted successfully',
      data: loan,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteLoan;
