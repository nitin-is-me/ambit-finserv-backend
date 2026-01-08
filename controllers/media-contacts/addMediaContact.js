const MediaContactModel = require('../../model/mediaContactModel');
const {customErrorMessages} = require('../../utils/helpers');
const {
  MediaContactsAddValidation,
} = require('../../validation/mediaContactsValidation');

const addMediaContact = async (req, res) => {
  try {
    await MediaContactsAddValidation.validateAsync(req.body);
    const newMediaContact = await MediaContactModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Media Contact added successfully',
      data: newMediaContact,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addMediaContact;
