const {customErrorMessages} = require('../../utils/helpers');
const CareerModel = require('../../model/careerModel');

const deleteCareer = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const career = await CareerModel.findByIdAndDelete(id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Career deleted successfully',
      data: career,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteCareer;
