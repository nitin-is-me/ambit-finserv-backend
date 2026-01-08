const CibilApiLog = require('../../model/cibilApiLogModel');
const {customErrorMessages} = require('../../utils/helpers');

const getCibilLogStats = async (req, res) => {
  try {
    const {from_date, to_date, mobile_number, IdentifierId} = req.query;

    // Build filter
    const filter = {};

    if (from_date || to_date) {
      filter.createdAt = {};
      if (from_date) {
        filter.createdAt.$gte = new Date(from_date);
      }
      if (to_date) {
        filter.createdAt.$lte = new Date(to_date);
      }
    }

    if (mobile_number) {
      filter.mobile_number = mobile_number;
    }

    if (IdentifierId) {
      filter.IdentifierId = IdentifierId;
    }

    // Get statistics
    const stats = await CibilApiLog.aggregate([
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
          total_timeouts: {
            $sum: {$cond: ['$is_timeout', 1, 0]},
          },
          total_retries: {
            $sum: {$cond: ['$is_retry', 1, 0]},
          },
        },
      },
    ]);

    // Get error breakdown by type
    const errorBreakdown = await CibilApiLog.aggregate([
      {$match: {...filter, error_occurred: true}},
      {
        $group: {
          _id: '$error_type',
          count: {$sum: 1},
        },
      },
      {$sort: {count: -1}},
    ]);

    // Get endpoint statistics
    const endpointStats = await CibilApiLog.aggregate([
      {$match: filter},
      {
        $group: {
          _id: {
            endpoint: '$endpoint',
            method: '$method',
          },
          count: {$sum: 1},
          avg_response_time: {$avg: '$response_time_ms'},
          error_count: {
            $sum: {$cond: ['$error_occurred', 1, 0]},
          },
        },
      },
      {$sort: {count: -1}},
      {$limit: 10},
    ]);

    // Get hourly distribution
    const hourlyDistribution = await CibilApiLog.aggregate([
      {$match: filter},
      {
        $group: {
          _id: {$hour: '$createdAt'},
          count: {$sum: 1},
          errors: {
            $sum: {$cond: ['$error_occurred', 1, 0]},
          },
        },
      },
      {$sort: {_id: 1}},
    ]);

    // Get action type distribution
    const actionTypeDistribution = await CibilApiLog.aggregate([
      {$match: filter},
      {
        $group: {
          _id: '$business_context.action_type',
          count: {$sum: 1},
          avg_response_time: {$avg: '$response_time_ms'},
          error_count: {
            $sum: {$cond: ['$error_occurred', 1, 0]},
          },
        },
      },
      {$sort: {count: -1}},
    ]);

    // Get device type distribution
    const deviceTypeDistribution = await CibilApiLog.aggregate([
      {$match: filter},
      {
        $group: {
          _id: '$client_info.device_type',
          count: {$sum: 1},
        },
      },
      {$sort: {count: -1}},
    ]);

    // Get network type distribution
    const networkTypeDistribution = await CibilApiLog.aggregate([
      {$match: filter},
      {
        $group: {
          _id: '$network_info.connection_type',
          count: {$sum: 1},
          avg_response_time: {$avg: '$response_time_ms'},
        },
      },
      {$sort: {count: -1}},
    ]);

    // Recent errors (last 10)
    const recentErrors = await CibilApiLog.find({
      ...filter,
      error_occurred: true,
    })
      .sort({createdAt: -1})
      .limit(10)
      .select(
        'endpoint method error_message error_type response_status createdAt mobile_number',
      );

    res.status(200).json({
      success: true,
      message: 'CIBIL API statistics fetched successfully',
      data: {
        overview: stats[0] || {
          total_requests: 0,
          total_errors: 0,
          total_success: 0,
          avg_response_time: 0,
          max_response_time: 0,
          min_response_time: 0,
          total_timeouts: 0,
          total_retries: 0,
        },
        error_breakdown: errorBreakdown,
        endpoint_stats: endpointStats,
        hourly_distribution: hourlyDistribution,
        action_type_distribution: actionTypeDistribution,
        device_type_distribution: deviceTypeDistribution,
        network_type_distribution: networkTypeDistribution,
        recent_errors: recentErrors,
      },
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getCibilLogStats;
