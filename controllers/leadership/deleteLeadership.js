const {customErrorMessages} = require('../../utils/helpers');
const Leadership = require('../../model/leadershipModel');

const deleteLeadership = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const leadership = await Leadership.findByIdAndDelete(id);

    if (!leadership) {
      return res.status(404).json({
        success: false,
        message: 'Leadership not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Leadership deleted successfully',
      data: leadership,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteLeadership;
