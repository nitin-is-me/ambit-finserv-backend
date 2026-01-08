const {customErrorMessages} = require('../../utils/helpers');
const Awards = require('../../model/awardsModel');
const {awardsUpdateValidation} = require('../../validation/awardsValidation');

const updateAwards = async (req, res) => {
  try {
    const {id} = req.params;
    const data = req.body;
    await awardsUpdateValidation.validateAsync(data);

    const award = await Awards.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: 'Award updated successfully',
      data: award,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateAwards;
