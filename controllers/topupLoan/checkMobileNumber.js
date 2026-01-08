const LoanApplication = require('../../model/loanApplicationsModel');
const {customErrorMessages} = require('../../utils/helpers');

const checkMobileNumber = async (req, res) => {
  try {
    const {mobile_number} = req.body;

    if (!mobile_number) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required',
      });
    }

    const existing = await LoanApplication.findOne({mobile_number});

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Mobile number already exists in loan application',
        exists: true,
        data: existing.uniqueID,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mobile number is available',
      exists: false,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message});
  }
};

module.exports = checkMobileNumber;
