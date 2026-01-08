const {customErrorMessages} = require('../../utils/helpers');
const ECards = require('../../model/eCard');

const deleteEcards = async (req, res) => {
  try {
    const {id} = req.params;
    const award = await ECards.findByIdAndDelete(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Ecards not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'ecards deleted successfully',
      data: award,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteEcards;
