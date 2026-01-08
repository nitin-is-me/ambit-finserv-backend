const CibilApiLog = require('../../model/cibilApiLogModel');
const {customErrorMessages} = require('../../utils/helpers');

const getCibilUserLogs = async (req, res) => {
  try {
    const {user_id, mobile_number, IdentifierId} = req.query;
    const {page = 1, limit = 50} = req.query;

    // Validate that at least one identifier is provided
    if (!user_id && !mobile_number && !IdentifierId) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide at least one of: user_id, mobile_number, or IdentifierId (PAN)',
      });
    }

    // Build filter based on provided identifiers
    const filter = {};

    if (user_id) {
      filter.user_id = user_id;
    }

    if (mobile_number) {
      filter.mobile_number = mobile_number;
    }

    if (IdentifierId) {
      filter.IdentifierId = IdentifierId;
    }

    // Pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Get total count for this user
    const totalCount = await CibilApiLog.countDocuments(filter);

    // Fetch logs for this user
    const logs = await CibilApiLog.find(filter)
      .sort({createdAt: -1})
      .skip(skip)
      .limit(pageSize);

    // Get user-specific statistics
    const userStats = await CibilApiLog.aggregate([
      {$match: filter},
      {
        $group: {
          _id: null,
          total_requests: {$sum: 1},
          total_errors: {
            $sum: {$cond: ['$error_occurred', 1, 0]},
          },
          total_success: {
            $sum: {$cond: ['$error_occurred', 0, 1]},
          },
          avg_response_time: {$avg: '$response_time_ms'},
          max_response_time: {$max: '$response_time_ms'},
          min_response_time: {$min: '$response_time_ms'},
          first_request: {$min: '$createdAt'},
          last_request: {$max: '$createdAt'},
        },
      },
    ]);

    // Get action timeline
    const actionTimeline = await CibilApiLog.aggregate([
      {$match: filter},
      {
        $group: {
          _id: '$business_context.action_type',
          count: {$sum: 1},
          last_occurred: {$max: '$createdAt'},
        },
      },
      {$sort: {last_occurred: -1}},
    ]);

    // Get error breakdown for this user
    const errorBreakdown = await CibilApiLog.aggregate([
      {$match: {...filter, error_occurred: true}},
      {
        $group: {
          _id: '$error_type',
          count: {$sum: 1},
          last_error: {$max: '$createdAt'},
          error_messages: {$push: '$error_message'},
        },
      },
      {$sort: {count: -1}},
    ]);

    // Get device/network usage for this user
    const deviceInfo = await CibilApiLog.aggregate([
      {$match: filter},
      {
        $group: {
          _id: {
            device_type: '$client_info.device_type',
            browser: '$client_info.browser',
            os: '$client_info.os',
          },
          count: {$sum: 1},
        },
      },
      {$sort: {count: -1}},
    ]);

    // Get external API calls for this user
    const externalApiCalls = await CibilApiLog.find({
      ...filter,
      'external_api_calls.0': {$exists: true}, // Has at least one external API call
    })
      .select('external_api_calls createdAt endpoint')
      .sort({createdAt: -1})
      .limit(20);

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      success: true,
      message: 'User-specific CIBIL logs fetched successfully',
      user_identifier: {
        user_id: user_id || null,
        mobile_number: mobile_number || null,
        IdentifierId: IdentifierId || null,
      },
      statistics: userStats[0] || {
        total_requests: 0,
        total_errors: 0,
        total_success: 0,
        avg_response_time: 0,
        max_response_time: 0,
        min_response_time: 0,
        first_request: null,
        last_request: null,
      },
      action_timeline: actionTimeline,
      error_breakdown: errorBreakdown,
      device_info: deviceInfo,
      external_api_calls: externalApiCalls,
      logs: logs,
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

module.exports = getCibilUserLogs;
