/* eslint-disable no-console */
const axios = require('axios');
const LoanApplications = require('../../model/loanApplicationsModel');
const {customErrorMessages} = require('../../utils/helpers');
const {
  loanApplicationAddValidation,
} = require('../../validation/loanApplicationValidation');
const {getOrCreateLeadIdForPhone} = require('../../utils/leadIdManager');
// const {
//   upsertDataExtensionRow,
// } = require('../../utils/salesforceMarketingCloud');

/**
 * Send Facebook Conversion API event
 * @param {Object} loanData - Loan application data
 * @param {Object} req - Express request object
 */
const sendFacebookConversionEvent = async (loanData, req) => {
  try {
    const eventData = [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: [loanData.email ? loanData.email.toLowerCase() : ''],
          ph: [loanData.mobile_number ? loanData.mobile_number : ''],
          client_ip_address: req.ip || req.connection.remoteAddress || '',
          client_user_agent: req.headers['user-agent'] || '',
          fbc: '',
          fbp: '',
        },
        custom_data: {
          currency: 'INR',
          value: parseFloat(loanData.loan_amount) || 0,
          content_name: 'Secured Business Loan Application',
          content_category: 'Business Loan',
          content_type: 'form_submit',
        },
        event_source_url: req.headers.referer || req.headers.origin || '',
        action_source: 'website',
      },
    ];

    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify(eventData));

    // Facebook Conversion API access token
    const fbAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    formData.append('access_token', fbAccessToken);

    const fbResponse = await axios.post(
      'https://graph.facebook.com/v23.0/500942765698315/events',
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // 10 second timeout
      },
    );

    if (fbResponse.status === 200) {
      // Facebook Conversion API call successful
    } else {
      // Facebook Conversion API call failed
    }
  } catch (error) {
    // Facebook API error - don't fail the main request
  }
};

const addLoanApplications = async (req, res) => {
  try {
    await loanApplicationAddValidation.validateAsync(req.body);

    // Normalize phone number for consistent checking (same normalization as in leadIdManager)
    const normalizePhone = phone =>
      phone.replace(/^\+91/, '').replace(/\s+/g, '').trim();
    const normalizedPhone = normalizePhone(req.body.mobile_number);

    // List of mobile numbers that are allowed to have multiple entries (normalized)
    const allowedMultipleNumbers = [
      '8169566724',
      '8806330055',
      '8291769041',
      '7977318015',
      '9137161942',
      '9767656602',
    ].map(normalizePhone);

    // Check for existing application only if the mobile number is not in the allowed list
    // Check both normalized and original format to catch any existing records
    if (!allowedMultipleNumbers.includes(normalizedPhone)) {
      const existingApplication = await LoanApplications.findOne({
        $or: [
          {mobile_number: req.body.mobile_number},
          {mobile_number: normalizedPhone},
        ],
      });
      if (existingApplication) {
        return res.status(409).json({
          success: false,
          message: 'A loan application with this mobile number already exists',
        });
      }
    }

    // Get or create lead_id for this phone number
    // This ensures one phone number always maps to one lead_id
    // Use normalized phone to ensure consistency
    const leadId = await getOrCreateLeadIdForPhone(req.body.mobile_number);

    // Ensure normalized phone is saved in database for consistency
    const applicationData = {
      ...req.body,
      mobile_number: normalizedPhone, // Save normalized phone number
      lead_id: leadId,
    };

    const newapplications = await LoanApplications.create(applicationData);

    // Convert Mongoose document to plain object to ensure all fields are serialized
    // This ensures lead_id and all other fields are included in the JSON response
    const applicationObj = newapplications.toObject
      ? newapplications.toObject()
      : newapplications;

    // Ensure lead_id is explicitly included (in case it's missing from serialization)
    if (!applicationObj.lead_id) {
      applicationObj.lead_id = leadId;
    }

    // Log for debugging
    console.log('✅ Loan application created successfully');
    console.log('📋 Application ID:', applicationObj._id);
    console.log('🆔 Lead ID in document:', applicationObj.lead_id);
    console.log('🆔 Lead ID variable:', leadId);

    // Send Facebook Conversion API event
    try {
      await sendFacebookConversionEvent(newapplications, req);
    } catch (fbError) {
      // Don't fail the main request if Facebook tracking fails
      console.error('Facebook Conversion API error:', fbError);
    }

    // Sync with Salesforce Marketing Cloud
    // try {
    //   await upsertDataExtensionRow(newapplications);
    // } catch (salesforceError) {
    //   // Don't fail the main request if Salesforce sync fails
    //   // The loan application is still created successfully
    // }

    // Return response with lead_id both in data object and at root level for easy access
    res.status(201).json({
      success: true,
      message: 'Loan application added successfully',
      data: applicationObj, // Plain object with lead_id included
      lead_id: leadId, // Also at root level for frontend convenience
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addLoanApplications;
