const LoanApplications = require('../../model/loanApplicationsModel');
const {customErrorMessages} = require('../../utils/helpers');

const getLoanApplications = async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      loan_type,
      page = 1,
      limit = 10,
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
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Get unique count of mobile_number
    const uniqueCountResult = await LoanApplications.aggregate([
      {$match: filter},
      {$group: {_id: '$mobile_number'}},
      {$count: 'totalUniqueEntries'},
    ]);

    const totalUniqueEntries =
      uniqueCountResult.length > 0
        ? uniqueCountResult[0].totalUniqueEntries
        : 0;

    let loanApplications = [];

    if (excel) {
      loanApplications = await LoanApplications.aggregate([
        {$match: filter},
        {$sort: {createdAt: -1}},
        {$group: {_id: '$mobile_number', doc: {$first: '$$ROOT'}}},
        {$replaceRoot: {newRoot: '$doc'}},
      ]);
    } else {
      loanApplications = await LoanApplications.aggregate([
        {$match: filter},
        {$sort: {createdAt: -1}},
        {$group: {_id: '$mobile_number', doc: {$first: '$$ROOT'}}},
        {$replaceRoot: {newRoot: '$doc'}},
        {$skip: skip},
        {$limit: pageSize},
      ]);
    }

    const totalPages = Math.ceil(totalUniqueEntries / pageSize);

    res.status(200).json({
      success: true,
      message: 'Loan applications fetched successfully',
      data: loanApplications,
      pagination: {
        totalEntries: totalUniqueEntries,
        totalPages,
        currentPage: pageNumber,
        pageSize,
      },
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message});
  }
};

module.exports = getLoanApplications;
