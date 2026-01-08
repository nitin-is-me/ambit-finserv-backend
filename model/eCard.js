const mongoose = require('mongoose');
const {Schema} = mongoose;

const ecards = new Schema(
  {
    first_name: String,
    last_name: String,
    mobile: String,
    email: String,
    dob: String,
    city: String,
    pincode: String,
    state: String,
    loan_type: String,
  },
  {
    timestamps: true,
  },
);

const ECards = mongoose.model('ecards', ecards);

module.exports = ECards;
