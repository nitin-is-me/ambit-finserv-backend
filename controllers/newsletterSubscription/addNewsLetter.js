const {customErrorMessages} = require('../../utils/helpers');
const NewsletterSubscription = require('../../model/newsletterSubscriptionModel');
const {
  newsletterSubscriptionAddValidation,
} = require('../../validation/newsletterSusbcriptionValidation');

const addNewsLetterSubscription = async (req, res) => {
  try {
    await newsletterSubscriptionAddValidation.validateAsync(req.body);

    const existingSubscription = await NewsletterSubscription.findOne({
      email: req.body.email.toLowerCase().trim(),
    });

    if (existingSubscription) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed to our newsletter',
      });
    }

    const newsletterSubscriptions = await NewsletterSubscription.create(
      req.body,
    );

    res.status(201).json({
      success: true,
      message: 'Subscription added successfully',
      data: newsletterSubscriptions,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed to our newsletter',
      });
    }

    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addNewsLetterSubscription;
