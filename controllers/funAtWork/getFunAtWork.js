const {customErrorMessages} = require('../../utils/helpers');
const FunAtWork = require('../../model/funAtWorkModel');

const getFunAtWork = async (req, res) => {
  try {
    const funAtWork = await FunAtWork.find();
    res.status(200).json({
      success: true,
      message: 'Images fetched successfully',
      data: funAtWork,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getFunAtWork;
