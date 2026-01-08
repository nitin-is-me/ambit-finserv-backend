const AffiliateMarketing = require('../../model/affiliateMarketingModel');
const {customErrorMessages} = require('../../utils/helpers');

const getAffiliateMarketing = async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      loan_type,
      page = 1,
      limit = 100,
      excel,
    } = req.query;
    const filter = {};

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      filter.createdAt = {$gte: from, $lte: to};
    } else if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      filter.createdAt = {$gte: from};
    } else if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      filter.createdAt = {$lte: to};
    }

    if (loan_type) {
      filter.loan_type = loan_type;
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = Math.min(parseInt(limit, 10), 100);
    const skip = (pageNumber - 1) * pageSize;

    // Get unique count of mobile_number
    const uniqueCountResult = await AffiliateMarketing.aggregate([
      {$match: filter},
      {$group: {_id: '$mobile_number'}},
      {$count: 'totalUniqueEntries'},
    ]);

    const totalUniqueEntries =
      uniqueCountResult.length > 0
        ? uniqueCountResult[0].totalUniqueEntries
        : 0;

    let affiliateMarketing = [];

    if (excel) {
      affiliateMarketing = await AffiliateMarketing.aggregate([
        {$match: filter},
        {
          $group: {
            _id: '$mobile_number',
            doc: {$first: '$$ROOT'},
            createdAt: {$first: '$createdAt'},
          },
        },
        {$replaceRoot: {newRoot: '$doc'}},
        {$sort: {createdAt: -1}},
      ]);
    } else {
      affiliateMarketing = await AffiliateMarketing.aggregate([
        {$match: filter},
        {
          $group: {
            _id: '$mobile_number',
            doc: {$first: '$$ROOT'},
            createdAt: {$first: '$createdAt'},
          },
        },
        {$replaceRoot: {newRoot: '$doc'}},
        {$sort: {createdAt: -1}},
        {$skip: skip},
        {$limit: pageSize},
      ]);
    }

    const totalPages = Math.ceil(totalUniqueEntries / pageSize);

    res.status(200).json({
      success: true,
      message: 'Loan applications fetched successfully',
      data: affiliateMarketing,
      pagination: {
        totalEntries: totalUniqueEntries,
        totalPages,
        currentPage: pageNumber,
        pageSize,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message});
  }
};

module.exports = getAffiliateMarketing;
