const BranchModel = require('../../model/branchAddressModel');
const {customErrorMessages} = require('../../utils/helpers');

const getBranchAddress = async (req, res) => {
  try {
    const branchAddress = await BranchModel.find({});
    res.status(200).json({
      success: true,
      message: 'Branch Addresses fetched successfully',
      data: branchAddress,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getBranchAddress;
