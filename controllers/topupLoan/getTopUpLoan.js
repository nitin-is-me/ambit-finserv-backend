const TopupLoan = require('../../model/topupLoan');
const {customErrorMessages} = require('../../utils/helpers');

const getTopupLoan = async (req, res) => {
  try {
    const {fromDate, toDate} = req.query;
    const filter = {};

    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(`${fromDate}T00:00:00.000Z`),
        $lte: new Date(`${toDate}T23:59:59.999Z`),
      };
    } else if (fromDate) {
      filter.createdAt = {$gte: new Date(`${fromDate}T00:00:00.000Z`)};
    } else if (toDate) {
      filter.createdAt = {$lte: new Date(`${toDate}T23:59:59.999Z`)};
    }

    const topup_loans = await TopupLoan.aggregate([
      {$match: filter},
      {$sort: {createdAt: -1}},
      {
        $group: {
          _id: '$mobile',
          latestEntry: {$first: '$$ROOT'},
        },
      },
      {$replaceRoot: {newRoot: '$latestEntry'}},
    ]);

    res.status(200).json({
      success: true,
      message: 'Topup loans fetched successfully',
      data: topup_loans,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message});
  }
};

module.exports = getTopupLoan;
