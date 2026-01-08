const mongoose = require('mongoose');
const {Schema} = mongoose;

const connectorAgreementSchema = new Schema(
  {
    full_name: String,
    email: String,
    mobile: String,
    otp: String,
    location: String,
    state: String,
    pincode: String,
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
  },
  {
    timestamps: true,
  },
);

const Connectors = mongoose.model(
  'connector_agreement',
  connectorAgreementSchema,
);

module.exports = Connectors;
