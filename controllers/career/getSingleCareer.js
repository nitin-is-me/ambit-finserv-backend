const {customErrorMessages} = require('../../utils/helpers');
const Career = require('../../model/careerModel');

const getSingleCareer = async (req, res) => {
  try {
    const {id} = req.body;
    const careers = await Career.findById(id);
    res.status(200).json({
      success: true,
      message: 'Single blogs fetched successfully',
      data: careers,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getSingleCareer;
