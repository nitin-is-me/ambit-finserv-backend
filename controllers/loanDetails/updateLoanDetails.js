const {customErrorMessages} = require('../../utils/helpers');
const Loandetails = require('../../model/loanDetailsModel');

const updateLoanDetails = async (req, res) => {
  try {
    const {
      loan_account_number,
      customer_name,
      registered_mobile,
      registered_email,
      installment_amount,
      sanction_amount,
      umrn,
      _id,
    } = req.body;

    const updateDetails = await Loandetails.updateOne(
      {_id},
      {
        loan_account_number,
        customer_name,
        registered_mobile,
        registered_email,
        installment_amount,
        sanction_amount,
        umrn,
      },
    );

    res.status(201).json({
      success: true,
      message: 'Loandetails updated successfully',
      data: updateDetails,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateLoanDetails;
