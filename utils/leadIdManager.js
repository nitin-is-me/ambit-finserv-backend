const PhoneLeadMapping = require('../model/phoneLeadMappingModel');
const LoanApplications = require('../model/loanApplicationsModel');

/**
 * Generate a unique 6-digit lead ID
 * @returns {string} 6-digit lead ID
 */
const generateUniqueLeadId = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Get or create a lead_id for a given phone number
 * Ensures one phone number always maps to one lead_id
 * @param {string} mobileNumber - The mobile number (without +91 prefix)
 * @returns {Promise<string>} The lead_id for this phone number
 */
const getOrCreateLeadIdForPhone = async mobileNumber => {
  try {
    // Normalize phone number (remove +91, spaces, etc.)
    const normalizedPhone = mobileNumber
      .replace(/^\+91/, '')
      .replace(/\s+/g, '')
      .trim();

    // Check if mapping already exists
    const mapping = await PhoneLeadMapping.findOne({
      mobile_number: normalizedPhone,
    });

    if (mapping) {
      // Return existing lead_id
      return mapping.lead_id;
    }

    // Check if this phone number has an existing loan application with lead_id
    const existingApplication = await LoanApplications.findOne({
      mobile_number: normalizedPhone,
    }).select('lead_id');

    if (existingApplication && existingApplication.lead_id) {
      // Use existing lead_id from loan application
      // Create mapping for future use
      await PhoneLeadMapping.create({
        mobile_number: normalizedPhone,
        lead_id: existingApplication.lead_id,
      });
      return existingApplication.lead_id;
    }

    // Generate new unique lead_id
    let leadId;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!isUnique && attempts < maxAttempts) {
      leadId = generateUniqueLeadId();

      // Check if lead_id already exists in mapping
      // eslint-disable-next-line no-await-in-loop
      const existingMapping = await PhoneLeadMapping.findOne({
        lead_id: leadId,
      });

      // Check if lead_id already exists in loan applications
      // eslint-disable-next-line no-await-in-loop
      const existingLoanApp = await LoanApplications.findOne({
        lead_id: leadId,
      });

      if (!existingMapping && !existingLoanApp) {
        isUnique = true;
      }

      attempts += 1;
    }

    if (!isUnique) {
      throw new Error(
        'Unable to generate unique lead ID after maximum attempts',
      );
    }

    // Create new mapping
    await PhoneLeadMapping.create({
      mobile_number: normalizedPhone,
      lead_id: leadId,
    });

    return leadId;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getOrCreateLeadIdForPhone:', error);
    throw error;
  }
};

/**
 * Get lead_id for a phone number if it exists
 * @param {string} mobileNumber - The mobile number
 * @returns {Promise<string|null>} The lead_id or null if not found
 */
const getLeadIdForPhone = async mobileNumber => {
  try {
    const normalizedPhone = mobileNumber
      .replace(/^\+91/, '')
      .replace(/\s+/g, '')
      .trim();

    const mapping = await PhoneLeadMapping.findOne({
      mobile_number: normalizedPhone,
    });

    if (mapping) {
      return mapping.lead_id;
    }

    // Check loan applications as fallback
    const existingApplication = await LoanApplications.findOne({
      mobile_number: normalizedPhone,
    }).select('lead_id');

    if (existingApplication && existingApplication.lead_id) {
      return existingApplication.lead_id;
    }

    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getLeadIdForPhone:', error);
    return null;
  }
};

module.exports = {
  getOrCreateLeadIdForPhone,
  getLeadIdForPhone,
  generateUniqueLeadId,
};
