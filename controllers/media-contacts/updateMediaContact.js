const {customErrorMessages} = require('../../utils/helpers');
const MediaContactModel = require('../../model/mediaContactModel');

const updateMediaContact = async (req, res) => {
  try {
    const {name, email, _id, address, designation} = req.body;

    const updatedMediaContact = await MediaContactModel.updateOne(
      {_id},
      {name, email, address, designation},
    );

    res.status(201).json({
      success: true,
      message: 'Media Contact updated successfully',
      data: updatedMediaContact,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateMediaContact;
