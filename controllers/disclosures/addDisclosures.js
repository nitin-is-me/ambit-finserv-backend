const Disclosures = require('../../model/disclosuresModel');
const {customErrorMessages} = require('../../utils/helpers');
const {
  disclosuresAddValidation,
} = require('../../validation/disclosuresValidation');

const addDisclosures = async (req, res) => {
  try {
    await disclosuresAddValidation.validateAsync(req.body);
    const newDisclosure = await Disclosures.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Disclosure added successfully',
      data: newDisclosure,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addDisclosures;
