const AffiliateMarketing = require('../../model/affiliateMarketingModel');
const {customErrorMessages} = require('../../utils/helpers');

const deleteAffiliateMarketing = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const affiliateMarketing = await AffiliateMarketing.findByIdAndDelete(id);

    if (!affiliateMarketing) {
      return res.status(404).json({
        success: false,
        message: 'Loan Affiliate Marketings not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Loan Affiliate Marketings deleted successfully',
      data: affiliateMarketing,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteAffiliateMarketing;
