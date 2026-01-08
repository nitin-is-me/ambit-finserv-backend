const qrCodes = require('../../model/qrCodesModel');

const getQrCodes = async (req, res) => {
  try {
    const {loan_id} = req.params;

    if (loan_id) {
      const qrCode = await qrCodes.findOne({loan_id});
      if (qrCode) {
        return res.status(200).json(qrCode);
      } else {
        return res
          .status(404)
          .json({message: `Loan number ${loan_id} doesn't exist.`});
      }
    } else {
      const allQrCodes = await qrCodes.find();
      return res.status(200).json(allQrCodes);
    }
  } catch (error) {
    return res
      .status(500)
      .json({error: 'An error occurred while fetching QR codes'});
  }
};

module.exports = getQrCodes;
