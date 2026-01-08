const mongoose = require('mongoose');
const {Schema} = mongoose;

const mediaContactSchema = new Schema(
  {
    name: String,
    email: String,
    address: String,
    mobile_number: Number,
    designation: String,
  },

  {
    timestamps: true,
  },
);

const MediaContacts = mongoose.model('media-contact', mediaContactSchema);

module.exports = MediaContacts;
