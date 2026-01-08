const {customErrorMessages} = require('../../utils/helpers');
const Partnerships = require('../../model/partnershipsModel');

const deletePartnerships = async (req, res) => {
  try {
    const {id} = req.params;
    const partnerships = await Partnerships.findByIdAndDelete(id);

    if (!partnerships) {
      return res.status(404).json({
        success: false,
        message: 'partnerships not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Partnerships deleted successfully',
      data: partnerships,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deletePartnerships;
