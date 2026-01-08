const {customErrorMessages} = require('../../utils/helpers');
const ECard = require('../../model/eCard');
// const {ECardsAddValidation} = require('../../validation/eCardsValidation');

const ECards = async (req, res) => {
  try {
    // await ECardsAddValidation.validateAsync(req.body);
    const award = await ECard.create(req.body);

    res.status(201).json({
      success: true,
      message: 'e-card added successfully',
      data: award,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = ECards;
