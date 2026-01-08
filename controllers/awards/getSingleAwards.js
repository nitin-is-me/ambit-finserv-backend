const {customErrorMessages} = require('../../utils/helpers');
const Awards = require('../../model/awardsModel');

const getSingleAwards = async (req, res) => {
  try {
    const {id} = req.params;
    const award = await Awards.findById(id);
    res.status(200).json({
      success: true,
      message: 'Single award fetched successfully',
      data: award,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getSingleAwards;
