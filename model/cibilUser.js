const mongoose = require('mongoose');
const {Schema} = mongoose;

const CibilUserSchema = new Schema(
  {
    // Basic Information
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    first_name: String,
    last_name: String,
    IdentifierName: String,
    IdentifierId: String,
    email: String,
    mobile_number: String,
    dob: Date,

    // CIBIL API Keys
    clientKey: String,
    PartnerCustomerId: String,

    // CIBIL Score Information
    cibil_score: Number,
    population_rank: Number,
    score_model: String,
    IVStatus: String,

    // Credit Analysis Fields
    bounces_last_3_months: {type: Number, default: 0},
    bounces_last_6_months: {type: Number, default: 0},
    bounces_last_12_months: {type: Number, default: 0},
    inquiries_last_1_month: {type: Number, default: 0},
    inquiries_last_3_months: {type: Number, default: 0},
    inquiries_last_6_months: {type: Number, default: 0},
    npa_tagging: {type: String, enum: ['YES', 'NO'], default: 'NO'},
    sma_tagging: {type: String, enum: ['YES', 'NO'], default: 'NO'},
    write_off_tagging_last_12_months: {
      type: String,
      enum: ['YES', 'NO'],
      default: 'NO',
    },
    maximum_delay_emi_payment: {type: Number, default: 0},
    timely_emi_payment_percentage: {type: Number, default: 100},

    // Calculated Fields
    credit_accounts_count: {type: Number, default: 0},
    inquiries_count: {type: Number, default: 0},
    high_credit_all_loans: {type: Number, default: 0},
    total_liabilities: {type: Number, default: 0},
    total_secured_loans: {type: Number, default: 0},
    total_unsecured_loans: {type: Number, default: 0},
    utm_source: {type: String, default: ''},
    utm_campaign: {type: String, default: ''},
    utm_medium: {type: String, default: ''},
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('CibilUser', CibilUserSchema);
