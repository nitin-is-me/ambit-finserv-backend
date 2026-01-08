const {customErrorMessages} = require('../../utils/helpers');
const Journey = require('../../model/journeyModel');

const updateJourney = async (req, res) => {
  try {
    const {year, description, _id} = req.body;

    const updatedJourney = await Journey.updateOne({_id}, {year, description});

    res.status(201).json({
      success: true,
      message: 'Journey updated successfully',
      data: updatedJourney,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateJourney;
