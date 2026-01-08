const {customErrorMessages} = require('../../utils/helpers');
const Faq = require('../../model/faqModel');

const deleteFaq = async (req, res) => {
  try {
    const {id} = req.params;
    const faq = await Faq.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'Faq not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Faq deleted successfully',
      data: faq,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteFaq;
