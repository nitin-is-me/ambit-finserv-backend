const MediaContactModel = require('../../model/mediaContactModel');
const {customErrorMessages} = require('../../utils/helpers');

const getMediaContacts = async (req, res) => {
  try {
    const mediaContacts = await MediaContactModel.find({});
    res.status(200).json({
      success: true,
      message: 'Media Contacts fetched successfully',
      data: mediaContacts,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getMediaContacts;
