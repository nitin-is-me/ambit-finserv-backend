const mongoose = require('mongoose');
const {Schema} = mongoose;

const ourValuesSchema = new Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  },
);

const OurValues = mongoose.model('ourValues', ourValuesSchema);

module.exports = OurValues;
