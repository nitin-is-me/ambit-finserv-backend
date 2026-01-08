const AffiliateMarketing = require('../../model/affiliateMarketingModel');
const {customErrorMessages} = require('../../utils/helpers');
const {
  affiliateMarketingAddValidation,
} = require('../../validation/affiliateMarketing');

const addAffiliateMarketing = async (req, res) => {
  try {
    await affiliateMarketingAddValidation.validateAsync(req.body);

    const existingApplication = await AffiliateMarketing.findOne({
      mobile_number: req.body.mobile_number,
    });
    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'A loan application with this mobile number already exists',
      });
    }

    const newapplications = await AffiliateMarketing.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Loan application added successfully',
      data: newapplications,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addAffiliateMarketing;
