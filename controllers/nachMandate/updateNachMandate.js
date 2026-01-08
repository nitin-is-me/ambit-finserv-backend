const {customErrorMessages} = require('../../utils/helpers');
const NachMandate = require('../../model/nachMandateModel');

const updateNachMandate = async (req, res) => {
  try {
    const {loan_account_number, registered_mobile, type_of_request, _id} =
      req.body;

    const updateNachMandates = await NachMandate.updateOne(
      {_id},
      {loan_account_number, registered_mobile, type_of_request},
    );

    res.status(201).json({
      success: true,
      message: 'Nachmandate updated successfully',
      data: updateNachMandates,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateNachMandate;
