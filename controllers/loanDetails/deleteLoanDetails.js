const {customErrorMessages} = require('../../utils/helpers');
const LoanDetails = require('../../model/loanDetailsModel');

const deleteLoanDetails = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const loandetails = await LoanDetails.findByIdAndDelete(id);

    if (!loandetails) {
      return res.status(404).json({
        success: false,
        message: 'Leadership not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Leadership deleted successfully',
      data: loandetails,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteLoanDetails;
