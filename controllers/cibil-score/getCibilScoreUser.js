const {customErrorMessages} = require('../../utils/helpers');
const CibilUser = require('../../model/cibilUser');
const CibilApiLog = require('../../model/cibilApiLogModel');

const getCibilUsers = async (req, res) => {
  try {
    const {include_logs = 'false', log_limit = '5'} = req.query;

    const users = await CibilUser.find().sort({
      createdAt: -1,
    });

    // Format response data with all fields
    const formattedUsers = await Promise.all(
      users.map(async user => {
        const userData = {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          mobile_number: user.mobile_number,
          IdentifierName: user.IdentifierName,
          IdentifierId: user.IdentifierId,
          clientKey: user.clientKey,
          PartnerCustomerId: user.PartnerCustomerId,
          gender: user.gender,
          dob: user.dob,

          // CIBIL Score Information
          cibil_score: user.cibil_score,
          population_rank: user.population_rank,
          score_model: user.score_model,
          IVStatus: user.IVStatus,

          // Credit Analysis Fields
          bounces_last_3_months: user.bounces_last_3_months,
          bounces_last_6_months: user.bounces_last_6_months,
          bounces_last_12_months: user.bounces_last_12_months,
          inquiries_last_1_month: user.inquiries_last_1_month,
          inquiries_last_3_months: user.inquiries_last_3_months,
          inquiries_last_6_months: user.inquiries_last_6_months,
          npa_tagging: user.npa_tagging,
          sma_tagging: user.sma_tagging,
          write_off_tagging_last_12_months:
            user.write_off_tagging_last_12_months,
          maximum_delay_emi_payment: user.maximum_delay_emi_payment,
          timely_emi_payment_percentage: user.timely_emi_payment_percentage,

          // Calculated Fields
          credit_accounts_count: user.credit_accounts_count,
          inquiries_count: user.inquiries_count,
          high_credit_all_loans: user.high_credit_all_loans,
          total_liabilities: user.total_liabilities,
          total_secured_loans: user.total_secured_loans,
          total_unsecured_loans: user.total_unsecured_loans,
          utm_source: user.utm_source,
          utm_medium: user.utm_medium,
          utm_campaign: user.utm_campaign,

          created_at: user.createdAt,
          updated_at: user.updatedAt,
        };

        // Include activity logs if requested
        if (include_logs === 'true') {
          // Build filter for this user
          const logFilter = {
            $or: [
              {user_id: user._id},
              {mobile_number: user.mobile_number},
              {IdentifierId: user.IdentifierId},
            ],
          };

          // Get activity statistics
          const activityStats = await CibilApiLog.aggregate([
            {$match: logFilter},
            {
              $group: {
                _id: null,
                total_requests: {$sum: 1},
                total_errors: {
                  $sum: {$cond: ['$error_occurred', 1, 0]},
                },
                avg_response_time: {$avg: '$response_time_ms'},
                last_activity: {$max: '$createdAt'},
              },
            },
          ]);

          // Get recent logs
          const recentLogs = await CibilApiLog.find(logFilter)
            .sort({createdAt: -1})
            .limit(parseInt(log_limit))
            .select(
              'endpoint method response_status response_time_ms error_occurred error_message createdAt business_context.action_type',
            );

          // Get error count by type
          const errorBreakdown = await CibilApiLog.aggregate([
            {$match: {...logFilter, error_occurred: true}},
            {
              $group: {
                _id: '$error_type',
                count: {$sum: 1},
              },
            },
          ]);

          userData.activity = {
            stats: activityStats[0] || {
              total_requests: 0,
              total_errors: 0,
              avg_response_time: 0,
              last_activity: null,
            },
            recent_logs: recentLogs,
            error_breakdown: errorBreakdown,
          };
        }

        return userData;
      }),
    );

    res.status(200).json({
      success: true,
      message: 'All Cibil users fetched successfully',
      data: formattedUsers,
      logs_included: include_logs === 'true',
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getCibilUsers;
