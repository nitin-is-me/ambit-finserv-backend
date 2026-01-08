const {customErrorMessages} = require('../../utils/helpers');
const Awards = require('../../model/awardsModel');

const deleteAwards = async (req, res) => {
  try {
    const {id} = req.params;
    const award = await Awards.findByIdAndDelete(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Award deleted successfully',
      data: award,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteAwards;
