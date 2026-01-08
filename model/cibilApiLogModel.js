const mongoose = require('mongoose');
const {Schema} = mongoose;

const CibilApiLogSchema = new Schema(
  {
    // Request Information
    endpoint: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      required: true,
    },

    // User Identification
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CibilUser',
    },
    mobile_number: String,
    IdentifierId: String, // PAN number

    // Request Details
    request_body: {
      type: Schema.Types.Mixed,
    },
    request_headers: {
      type: Schema.Types.Mixed,
    },
    request_params: {
      type: Schema.Types.Mixed,
    },
    request_query: {
      type: Schema.Types.Mixed,
    },

    // Response Details
    response_status: Number,
    response_body: {
      type: Schema.Types.Mixed,
    },
    response_time_ms: Number, // Time taken for request

    // Error Information
    error_occurred: {
      type: Boolean,
      default: false,
    },
    error_message: String,
    error_stack: String,
    error_type: {
      type: String,
      enum: [
        'validation_error',
        'database_error',
        'network_error',
        'timeout_error',
        'authentication_error',
        'authorization_error',
        'external_api_error',
        'unknown_error',
      ],
    },

    // Client Information (from Frontend)
    client_info: {
      ip_address: String,
      user_agent: String,
      browser: String,
      browser_version: String,
      os: String,
      device_type: String, // mobile, tablet, desktop
      screen_resolution: String,
      timezone: String,
      language: String,
    },

    // Network Information
    network_info: {
      connection_type: String, // 4g, 5g, wifi, ethernet
      effective_type: String, // slow-2g, 2g, 3g, 4g
      downlink: Number, // Mbps
      rtt: Number, // Round trip time in ms
      save_data: Boolean, // Data saver mode
    },

    // External API Calls (if calling CIBIL API)
    external_api_calls: [
      {
        api_name: String,
        endpoint: String,
        method: String,
        request_time: Date,
        response_time: Date,
        duration_ms: Number,
        status_code: Number,
        success: Boolean,
        error_message: String,
        request_payload: Schema.Types.Mixed,
        response_payload: Schema.Types.Mixed,
      },
    ],

    // Performance Metrics
    performance: {
      database_query_time: Number,
      validation_time: Number,
      processing_time: Number,
      total_time: Number,
    },

    // Business Logic Information
    business_context: {
      action_type: {
        type: String,
        enum: [
          'create_user',
          'update_user',
          'fetch_user',
          'check_existing',
          'fetch_cibil_score',
          'verify_identity',
        ],
      },
      is_new_user: Boolean,
      is_existing_user: Boolean,
      data_source: String, // web, mobile_app, api
      utm_source: String,
      utm_medium: String,
      utm_campaign: String,
    },

    // Session Information
    session_id: String,
    request_id: String, // Unique ID for tracking request across systems

    // Additional Metadata
    environment: {
      type: String,
      enum: ['development', 'staging', 'production'],
      default: process.env.NODE_ENV || 'development',
    },
    server_info: {
      hostname: String,
      node_version: String,
      server_time: Date,
    },

    // Flags for Analysis
    is_retry: {
      type: Boolean,
      default: false,
    },
    retry_count: {
      type: Number,
      default: 0,
    },
    is_timeout: {
      type: Boolean,
      default: false,
    },
    is_rate_limited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
CibilApiLogSchema.index({createdAt: -1});
CibilApiLogSchema.index({user_id: 1});
CibilApiLogSchema.index({mobile_number: 1});
CibilApiLogSchema.index({IdentifierId: 1});
CibilApiLogSchema.index({error_occurred: 1});
CibilApiLogSchema.index({endpoint: 1, method: 1});
CibilApiLogSchema.index({request_id: 1});
CibilApiLogSchema.index({'business_context.action_type': 1});

module.exports = mongoose.model('CibilApiLog', CibilApiLogSchema);
