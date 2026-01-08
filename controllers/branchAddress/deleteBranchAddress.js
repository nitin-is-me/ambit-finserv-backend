const {customErrorMessages} = require('../../utils/helpers');
const BranchAddress = require('../../model/branchAddressModel');

const deleteBranchAddress = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const branchAddress = await BranchAddress.findByIdAndDelete(id);

    if (!branchAddress) {
      return res.status(404).json({
        success: false,
        message: 'Branch address not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Branch address deleted successfully',
      data: branchAddress,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteBranchAddress;
