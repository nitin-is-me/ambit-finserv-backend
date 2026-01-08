const {customErrorMessages} = require('../../utils/helpers');
const Partnerships = require('../../model/partnershipsModel');

const getPartnerships = async (req, res) => {
  try {
    const partnerships = await Partnerships.find();
    res.status(200).json({
      success: true,
      message: 'All Partnerships fetched successfully',
      data: partnerships,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getPartnerships;
