const {customErrorMessages} = require('../../utils/helpers');
const NewsletterSubscription = require('../../model/newsletterSubscriptionModel');
const {
  newsletterSubscriptionUpdateValidation,
} = require('../../validation/newsletterSusbcriptionValidation');

const updateSusbcription = async (req, res) => {
  try {
    await newsletterSubscriptionUpdateValidation.validateAsync(req.body);
    const {email, _id} = req.body;

    // Check if email already exists for a different subscription
    if (email) {
      const existingSubscription = await NewsletterSubscription.findOne({
        email: email.toLowerCase().trim(),
        _id: {$ne: _id}, // Exclude current subscription from check
      });

      if (existingSubscription) {
        return res.status(409).json({
          success: false,
          message: 'This email is already subscribed to our newsletter',
        });
      }
    }

    const updateSubscriptions = await NewsletterSubscription.updateOne(
      {_id},
      {email: email ? email.toLowerCase().trim() : email},
    );

    res.status(201).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updateSubscriptions,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error
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

module.exports = updateSusbcription;
