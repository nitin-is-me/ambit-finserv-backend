const mongoose = require('mongoose');
const {Schema} = mongoose;

const annualReportsSchema = new Schema(
  {
    title: String,
    description: String,
    upload_document: String,
    year: Number,
  },
  {
    timestamps: true,
  },
);

const AnnualReports = mongoose.model('annual-reports', annualReportsSchema);

module.exports = AnnualReports;
