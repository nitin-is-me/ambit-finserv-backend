const {customErrorMessages} = require('../../utils/helpers');
const TopupLoan = require('../../model/topupLoan');

const addTopupLoan = async (req, res) => {
  try {
    // const existing = await TopupLoan.findOne({
    //   mobile: req.body.mobile,
    // });
    // if (existing) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Mobile Number already registered',
    //   });
    // }

    const loan = await TopupLoan.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Topup loan added successfully',
      data: loan,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addTopupLoan;
