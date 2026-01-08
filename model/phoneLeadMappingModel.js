const mongoose = require('mongoose');
const {Schema} = mongoose;

const phoneLeadMappingSchema = new Schema(
  {
    mobile_number: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lead_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const PhoneLeadMapping = mongoose.model(
  'phone_lead_mapping',
  phoneLeadMappingSchema,
);

module.exports = PhoneLeadMapping;
