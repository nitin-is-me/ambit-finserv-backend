const mongoose = require('mongoose');
const {Schema} = mongoose;

const addressSchema = new Schema(
  {
    address: String,
    subAddress: String,
    mobile: String,
    email: String,
  },
  {
    timestamps: true,
  },
);

const Address = mongoose.model('address', addressSchema);

module.exports = Address;
