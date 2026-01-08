const {customErrorMessages} = require('../../utils/helpers');
const Partnerships = require('../../model/partnershipsModel');
const {
  partnershipsAddValidation,
} = require('../../validation/partnershipsValidation');

const addPartnerships = async (req, res) => {
  try {
    await partnershipsAddValidation.validateAsync(req.body);
    const partnerships = await Partnerships.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Partnerships added successfully',
      data: partnerships,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addPartnerships;
