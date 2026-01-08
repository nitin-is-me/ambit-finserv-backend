const {customErrorMessages} = require('../../utils/helpers');
const NachMandate = require('../../model/nachMandateModel');

const deleteNachMandate = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const nachMandate = await NachMandate.findByIdAndDelete(id);

    if (!nachMandate) {
      return res.status(404).json({
        success: false,
        message: 'Nachmandate not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'NachMandate deleted successfully',
      data: nachMandate,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteNachMandate;
