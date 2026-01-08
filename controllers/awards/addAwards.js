const {customErrorMessages} = require('../../utils/helpers');
const Awards = require('../../model/awardsModel');
const {awardsAddValidation} = require('../../validation/awardsValidation');

const addAwards = async (req, res) => {
  try {
    await awardsAddValidation.validateAsync(req.body);
    const award = await Awards.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Award added successfully',
      data: award,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addAwards;
