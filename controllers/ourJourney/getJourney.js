const {customErrorMessages} = require('../../utils/helpers');
const Journey = require('../../model/journeyModel');

const getAllJourney = async (req, res) => {
  try {
    const ourJourney = await Journey.find();

    res.status(200).json({
      success: true,
      message: 'All Journey',
      data: ourJourney,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getAllJourney;
