const {customErrorMessages} = require('../../utils/helpers');
const Address = require('../../model/addressModel');
const {addressAddValidation} = require('../../validation/addressValidation');

const addAddress = async (req, res) => {
  try {
    await addressAddValidation.validateAsync(req.body);
    const award = await Address.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: award,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addAddress;
