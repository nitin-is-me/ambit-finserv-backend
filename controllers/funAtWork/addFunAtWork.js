const {customErrorMessages} = require('../../utils/helpers');
const FunAtWork = require('../../model/funAtWorkModel');
const {
  funAtWorkAddValidation,
} = require('../../validation/funAtWorkValidation');

const addFunAtWork = async (req, res) => {
  try {
    await funAtWorkAddValidation.validateAsync(req.body);
    const funAtWork = await FunAtWork.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Image added successfully',
      data: funAtWork,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addFunAtWork;
