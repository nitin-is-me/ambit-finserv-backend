const {customErrorMessages} = require('../../utils/helpers');
const LoansModel = require('../../model/loansModel');

const updateLoan = async (req, res) => {
  try {
    const {_id, overview, features, eligibility, required_documents} = req.body;

    const updatedLoan = await LoansModel.updateOne(
      {_id},
      {overview, features, eligibility, required_documents},
    );

    res.status(201).json({
      success: true,
      message: 'Loan updated successfully',
      data: updatedLoan,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateLoan;
