const LoanApplications = require('../../model/loanApplicationsModel');
const {customErrorMessages} = require('../../utils/helpers');

const checkLoanApplications = async (req, res) => {
  try {
    const {mobile_number} = req.body;
    const existingApplication = await LoanApplications.findOne({
      mobile_number: mobile_number,
    });
    if (!existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'No loan application found with this mobile number',
      });
    }
    return res.status(200).json({
      success: false,
      message: 'A loan application with this mobile number already exists',
      data: existingApplication.uniqueID,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = checkLoanApplications;
