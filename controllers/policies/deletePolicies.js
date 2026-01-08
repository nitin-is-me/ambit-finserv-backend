const {customErrorMessages} = require('../../utils/helpers');
const Policies = require('../../model/policiesModel');

const deletePolicy = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const policy = await Policies.findByIdAndDelete(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Policy deleted successfully',
      data: policy,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deletePolicy;
