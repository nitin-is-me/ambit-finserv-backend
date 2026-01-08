const {customErrorMessages} = require('../../utils/helpers');
const Partnerships = require('../../model/partnershipsModel');
const {
  partnershipsUpdateValidation,
} = require('../../validation/partnershipsValidation');

const updatePartnerships = async (req, res) => {
  try {
    const {id} = req.params;
    const data = req.body;
    await partnershipsUpdateValidation.validateAsync(data);

    const partnerships = await Partnerships.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: 'Partnerships updated successfully',
      data: partnerships,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updatePartnerships;
