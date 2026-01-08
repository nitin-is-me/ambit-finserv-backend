const mongoose = require('mongoose');
const {Schema} = mongoose;

const topupLoan = new Schema(
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
    twelve_month_bank_statement: String,
  },
  {
    timestamps: true,
  },
);

const Topuploans = mongoose.model('topup_loan', topupLoan);

module.exports = Topuploans;
