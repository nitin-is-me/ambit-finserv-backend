const mongoose = require('mongoose');
const {Schema} = mongoose;

const leadershipSchema = new Schema(
  {
    name: String,
    image: String,
    description: String,
    designation: String,
  },
  {
    timestamps: true,
  },
);

const Leadership = mongoose.model('leadership', leadershipSchema);

module.exports = Leadership;
