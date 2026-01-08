const {customErrorMessages} = require('../../utils/helpers');
const PerksModel = require('../../model/perksModel');

const deletePerks = async (req, res) => {
  try {
    const {id} = req.body;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const perks = await PerksModel.findByIdAndDelete(id);

    if (!perks) {
      return res.status(404).json({
        success: false,
        message: 'Perks not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Perks deleted successfully',
      data: perks,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deletePerks;
