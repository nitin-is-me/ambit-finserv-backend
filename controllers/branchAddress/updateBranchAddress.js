const {customErrorMessages} = require('../../utils/helpers');
const BranchAddress = require('../../model/branchAddressModel');

const updateBranchAddress = async (req, res) => {
  try {
    const {_id, branch_location, state, branch_address} = req.body;

    const updatedCareer = await BranchAddress.updateOne(
      {_id},
      {branch_address, state, branch_location},
    );

    res.status(201).json({
      success: true,
      message: 'Branch Address updated successfully',
      data: updatedCareer,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateBranchAddress;
