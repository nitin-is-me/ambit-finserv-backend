const {customErrorMessages} = require('../../utils/helpers');
const MediaContactModel = require('../../model/mediaContactModel');

const deleteMediaContact = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const mediaContact = await MediaContactModel.findByIdAndDelete(id);

    if (!mediaContact) {
      return res.status(404).json({
        success: false,
        message: 'Media Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Media Contact deleted successfully',
      data: mediaContact,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteMediaContact;
