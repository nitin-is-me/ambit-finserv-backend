const CareerModel = require('../../model/careerModel');
const {customErrorMessages} = require('../../utils/helpers');

const getCareers = async (req, res) => {
  try {
    const career = await CareerModel.find({});
    res.status(200).json({
      success: true,
      message: 'Careers fetched successfully',
      data: career,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getCareers;
