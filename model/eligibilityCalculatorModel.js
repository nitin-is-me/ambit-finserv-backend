const mongoose = require('mongoose');
const {Schema} = mongoose;
const crypto = require('crypto');

const eligibilityCalculatorSchema = new Schema(
  {
    lead_id: {
      type: String,
      unique: true,
    },
    token_id: {
      type: String,
    },
    uniqueID: {
      type: String,
      unique: true,
    },
    // Required fields only
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },

    // Existing optional fields
    loan_type: {
      type: String,
    },
    utm_source: {
      type: String,
    },
    utm_medium: {
      type: String,
    },
    utm_campaign: {
      type: String,
    },

    // New calculator fields
    businessVintage: {
      type: Number,
    },
    annualTurnover: {
      type: Number,
    },
    natureOfBusiness: {
      type: String,
    },
    avgMonthlyBankBalance: {
      type: Number,
    },
    existingEmiObligations: {
      type: Number,
    },
    propertyType: {
      type: String,
    },
    propertyValue: {
      type: Number,
    },
    eligibilityAmount: {
      type: Number,
    },
    eligibilityType: {
      type: String,
    },
    calculationTimestamp: {
      type: Date,
    },
    userAge: {
      type: Number,
    },
    formSubmissionTimestamp: {
      type: Date,
    },
    sessionId: {
      type: String,
    },

    // OTP verification status
    is_otp_verified: {
      type: Boolean,
      default: false,
    },
    // Timestamps
    calculated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Generate unique 6-digit lead ID
const generateUniqueLeadId = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Generate hashed token
const generateHashedToken = (leadId = '') => {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2);
  const combined = `${timestamp}${randomString}${leadId}ambit_finserv_eligibility`;

  return crypto.createHash('sha256').update(combined).digest('hex');
};

// Pre-save middleware to generate lead_id and token_id if not provided
eligibilityCalculatorSchema.pre('save', function preSave(next) {
  try {
    if (!this.lead_id) {
      this.lead_id = generateUniqueLeadId();
    }
    if (!this.token_id) {
      this.token_id = generateHashedToken(this.lead_id);
    }
    if (!this.uniqueID) {
      this.uniqueID = `EC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const EligibilityCalculator = mongoose.model(
  'eligibility_calculator',
  eligibilityCalculatorSchema,
);

module.exports = EligibilityCalculator;
