const PerksModel = require('../../model/perksModel');
const {customErrorMessages} = require('../../utils/helpers');
const {PerksAddValidation} = require('../../validation/perksValidation');

const addPerks = async (req, res) => {
  try {
    await PerksAddValidation.validateAsync(req.body);
    const newPerk = await PerksModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Perks added successfully',
      data: newPerk,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addPerks;
