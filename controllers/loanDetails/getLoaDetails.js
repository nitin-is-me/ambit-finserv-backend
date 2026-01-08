const {customErrorMessages} = require('../../utils/helpers');
const Loandetails = require('../../model/loanDetailsModel');

const getLoanDetails = async (req, res) => {
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

    const loandetails = await Loandetails.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'All leaderships',
      data: loandetails,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getLoanDetails;
