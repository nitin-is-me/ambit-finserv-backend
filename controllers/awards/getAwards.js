const {customErrorMessages} = require('../../utils/helpers');
const Awards = require('../../model/awardsModel');

const getAwards = async (req, res) => {
  try {
    const award = await Awards.find();
    res.status(200).json({
      success: true,
      message: 'All Awards fetched successfully',
      data: award,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getAwards;
