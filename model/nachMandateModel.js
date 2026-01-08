const mongoose = require('mongoose');
const {Schema} = mongoose;

const nachMandateSchema = new Schema(
  {
    loan_account_number: String,
    registered_mobile: String,
    type_of_request: String,
  },
  {
    timestamps: true,
  },
);

const NachMandate = mongoose.model('nachMandate', nachMandateSchema);

module.exports = NachMandate;
