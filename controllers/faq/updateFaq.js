const {customErrorMessages} = require('../../utils/helpers');
const Faq = require('../../model/faqModel');
const {faqUpdateValidation} = require('../../validation/faqValidation');

const updateFaq = async (req, res) => {
  try {
    const {id} = req.params;
    const data = req.body;
    await faqUpdateValidation.validateAsync(data);
    const faq = await Faq.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: 'Faq updated successfully',
      data: faq,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateFaq;
