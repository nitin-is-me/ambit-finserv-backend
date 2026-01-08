const QrForm = require('../../model/qrFormModel');
const {customErrorMessages} = require('../../utils/helpers');

exports.createQrForm = async (req, res) => {
  try {
    const qrForm = await QrForm.create(req.body);

    res.status(201).json({
      success: true,
      message: 'QRC Form created successfully',
      data: qrForm,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};
