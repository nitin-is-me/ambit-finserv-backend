const CibilApiLog = require('../../model/cibilApiLogModel');
const {customErrorMessages} = require('../../utils/helpers');

const getCibilLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      error_only = false,
      mobile_number,
      IdentifierId,
      user_id,
      endpoint,
      method,
      error_type,
      action_type,
      from_date,
      to_date,
      request_id,
    } = req.query;

    // Build filter
    const filter = {};

    if (error_only === 'true') {
      filter.error_occurred = true;
    }

    if (mobile_number) {
      filter.mobile_number = mobile_number;
    }

    if (IdentifierId) {
      filter.IdentifierId = IdentifierId;
    }

    if (user_id) {
      filter.user_id = user_id;
    }

    if (endpoint) {
      filter.endpoint = new RegExp(endpoint, 'i');
    }

    if (method) {
      filter.method = method.toUpperCase();
    }

    if (error_type) {
      filter.error_type = error_type;
    }

    if (action_type) {
      filter['business_context.action_type'] = action_type;
    }

    if (request_id) {
      filter.request_id = request_id;
    }

    // Date range filter
    if (from_date || to_date) {
      filter.createdAt = {};
      if (from_date) {
        filter.createdAt.$gte = new Date(from_date);
      }
      if (to_date) {
        filter.createdAt.$lte = new Date(to_date);
      }
    }

    // Pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Get total count
    const totalCount = await CibilApiLog.countDocuments(filter);

    // Fetch logs
    const logs = await CibilApiLog.find(filter)
      .sort({createdAt: -1})
      .skip(skip)
      .limit(pageSize)
      .populate('user_id', 'first_name last_name mobile_number IdentifierId');

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      success: true,
      message: 'CIBIL API logs fetched successfully',
      data: logs,
      pagination: {
        total_entries: totalCount,
        total_pages: totalPages,
        current_page: pageNumber,
        page_size: pageSize,
      },
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getCibilLogs;
