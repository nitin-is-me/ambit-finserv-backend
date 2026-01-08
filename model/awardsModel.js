const mongoose = require('mongoose');
const {Schema} = mongoose;

const awardsSchema = new Schema(
  {
    image: String,
    title: String,
    description: String,
  },
  {
    timestamps: true,
  },
);

const Awards = mongoose.model('awards', awardsSchema);

module.exports = Awards;
