const mongoose = require('mongoose');

const qrFormSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    contact: Number,
    loanNumber: String,
    concernType: String,
    loanRelatedType: String,
    documentRelatedType: String,
    serviceRelatedType: String,
    message: String,
    SupportingDocument: String,
  },
  {
    timestamps: true,
  },
);
const QrForm = mongoose.model('QrForm', qrFormSchema);

module.exports = QrForm;
