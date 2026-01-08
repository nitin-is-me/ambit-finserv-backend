const {customErrorMessages} = require('../../utils/helpers');
const {journeyValidation} = require('../../validation/journeyValidation');
const Journey = require('../../model/journeyModel');

const addJourney = async (req, res) => {
  try {
    await journeyValidation.validateAsync(req.body);

    const {year, description} = req.body;

    const newJourney = await Journey.create({
      year,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Our Journey added successfully',
      data: newJourney,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addJourney;
