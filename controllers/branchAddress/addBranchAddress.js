const {customErrorMessages} = require('../../utils/helpers');
const BranchAddress = require('../../model/branchAddressModel');
const {
  branchAddressAddValidation,
} = require('../../validation/branchAddressValidation');

const addBranchAddress = async (req, res) => {
  try {
    await branchAddressAddValidation.validateAsync(req.body);
    const award = await BranchAddress.create(req.body);

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

module.exports = addBranchAddress;
