const mongoose = require('mongoose');
const {Schema} = mongoose;

const policiesSchema = new Schema(
  {
    title: String,
    description: String,
    upload_document: String,
    year: String,
  },
  {
    timestamps: true,
  },
);

const Policies = mongoose.model('policies', policiesSchema);

module.exports = Policies;
