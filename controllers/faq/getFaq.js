const {customErrorMessages} = require('../../utils/helpers');
const Faq = require('../../model/faqModel');

const getFaq = async (req, res) => {
  try {
    const faq = await Faq.find();
    res.status(200).json({
      success: true,
      message: 'All faq fetched successfully',
      data: faq,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getFaq;
