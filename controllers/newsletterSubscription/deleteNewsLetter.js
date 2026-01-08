const {customErrorMessages} = require('../../utils/helpers');
const NewsletterSubscription = require('../../model/newsletterSubscriptionModel');

const deleteNewsletter = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const deleteletter = await NewsletterSubscription.findByIdAndDelete(id);

    if (!deleteletter) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
      data: deleteletter,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteNewsletter;
