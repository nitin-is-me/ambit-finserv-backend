const {customErrorMessages} = require('../../utils/helpers');
const Faq = require('../../model/faqModel');
const {faqAddValidation} = require('../../validation/faqValidation');

const addFaq = async (req, res) => {
  try {
    await faqAddValidation.validateAsync(req.body);
    const faq = await Faq.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Faq added successfully',
      data: faq,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addFaq;
