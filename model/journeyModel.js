const mongoose = require('mongoose');
const {Schema} = mongoose;

const journeySchema = new Schema(
  {
    year: Number,
    description: String,
  },
  {
    timestamps: true,
  },
);

const Journey = mongoose.model('journey', journeySchema);

module.exports = Journey;
