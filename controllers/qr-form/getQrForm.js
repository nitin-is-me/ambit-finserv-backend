const QrForm = require('../../model/qrFormModel');
const {customErrorMessages} = require('../../utils/helpers');

exports.getQrForm = async (req, res) => {
  try {
    const qrForms = await QrForm.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'All QRC Forms fetched successfully',
      data: qrForms,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};
