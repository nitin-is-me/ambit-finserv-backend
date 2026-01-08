const mongoose = require('mongoose');
const {Schema} = mongoose;

const qrModels = new Schema(
  {
    loan_id: String,
    customer_name: String,
    product_name: String,
    system_tagging: String,
    qr_code_link: String,
  },

  {
    timestamps: true,
  },
);

const qrs = mongoose.model('qrCodes', qrModels);

module.exports = qrs;
