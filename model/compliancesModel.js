const mongoose = require('mongoose');
const {Schema} = mongoose;

const listingSchema = new Schema(
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

const Compliances = mongoose.model('compliances', listingSchema);

module.exports = Compliances;
