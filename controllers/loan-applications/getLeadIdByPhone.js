const {getOrCreateLeadIdForPhone} = require('../../utils/leadIdManager');
const {customErrorMessages} = require('../../utils/helpers');

/**
 * Get or create lead_id for a phone number
 * This ensures one phone number always maps to one lead_id
 */
const getLeadIdByPhone = async (req, res) => {
  try {
    const {mobile_number} = req.body;

    if (!mobile_number) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required',
      });
    }

    // Get or create lead_id for this phone number
    const leadId = await getOrCreateLeadIdForPhone(mobile_number);

    res.status(200).json({
      success: true,
      lead_id: leadId,
      mobile_number,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getLeadIdByPhone:', error);
    const message = customErrorMessages(error);
    res.status(500).json({
      success: false,
      message: message || 'Failed to get lead_id',
    });
  }
};

module.exports = getLeadIdByPhone;
