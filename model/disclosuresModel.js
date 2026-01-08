const mongoose = require('mongoose');
const {Schema} = mongoose;

const disclosuresSchema = new Schema(
  {
    title: String,
    description: String,
    type: String,
    upload_document: String,
    year: String,
  },
  {
    timestamps: true,
  },
);

const Disclosures = mongoose.model('disclosures', disclosuresSchema);

module.exports = Disclosures;
