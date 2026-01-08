const {customErrorMessages} = require('../../utils/helpers');
const Address = require('../../model/addressModel');
const {addressUpdateValidation} = require('../../validation/addressValidation');

const updateAddress = async (req, res) => {
  try {
    const {id} = req.params;
    const data = req.body;
    await addressUpdateValidation.validateAsync(data);

    const address = await Address.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: 'Address updated successfully',
      data: address,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateAddress;
