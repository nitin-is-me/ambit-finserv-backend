const {customErrorMessages} = require('../../utils/helpers');
const Leadership = require('../../model/leadershipModel');

const getAllLeadership = async (req, res) => {
  try {
    const leadership = await Leadership.find();

    res.status(200).json({
      success: true,
      message: 'All leaderships',
      data: leadership,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getAllLeadership;
