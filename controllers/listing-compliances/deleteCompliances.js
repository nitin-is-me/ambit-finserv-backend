const {customErrorMessages} = require('../../utils/helpers');
const Compliances = require('../../model/compliancesModel');

const deleteCompliances = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const compliances = await Compliances.findByIdAndDelete(id);

    if (!compliances) {
      return res.status(404).json({
        success: false,
        message: 'listing compliances not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'listing compliances deleted successfully',
      data: compliances,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteCompliances;
