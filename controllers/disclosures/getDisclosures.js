const Disclosures = require('../../model/disclosuresModel');
const {customErrorMessages} = require('../../utils/helpers');

const getDisclosures = async (req, res) => {
  try {
    const {fromDate, toDate} = req.query;

    // Create filter object
    const filter = {};

    // Add date range filter if fromDate and toDate are provided
    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    } else if (fromDate) {
      filter.createdAt = {
        $gte: new Date(fromDate),
      };
    } else if (toDate) {
      filter.createdAt = {
        $lte: new Date(toDate),
      };
    }

    const disclosure = await Disclosures.find(filter).sort({createdAt: -1});
    res.status(200).json({
      success: true,
      message: 'Disclosure fetched successfully',
      data: disclosure,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getDisclosures;
