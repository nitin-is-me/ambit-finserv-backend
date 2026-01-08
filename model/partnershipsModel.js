const mongoose = require('mongoose');
const {Schema} = mongoose;

const partnershipsSchema = new Schema(
  {
    name: String,
    image: String,
    description: String,
    privacyPolicy: String,
    grievance_officer_name: String,
    grievance_officer_mobile: String,
    grievance_officer_email: String,
    grievance_officer_address: String,
  },
  {
    timestamps: true,
  },
);

const Partnerships = mongoose.model('partnerships', partnershipsSchema);

module.exports = Partnerships;
