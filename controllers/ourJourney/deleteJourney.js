const {customErrorMessages} = require('../../utils/helpers');
const Journey = require('../../model/journeyModel');

const deleteJourney = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const journey = await Journey.findByIdAndDelete(id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Journey deleted successfully',
      data: journey,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteJourney;
