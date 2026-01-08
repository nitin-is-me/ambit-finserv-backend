const {customErrorMessages} = require('../../utils/helpers');
const BranchAddress = require('../../model/branchAddressModel');

const deleteMultiBranchAddess = async (req, res) => {
  try {
    const {ids} = req.body;

    if (!Array.isArray(ids) || ids.some(id => !id.match(/^[0-9a-fA-F]{24}$/))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const result = await BranchAddress.deleteMany({_id: {$in: ids}});

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No branch addresses found for the provided IDs',
      });
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} branch addresses deleted successfully`,
      data: result,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteMultiBranchAddess;
