const mongoose = require('mongoose');
const {Schema} = mongoose;

const perksSchema = new Schema(
  {
    name: String,
    icon: String,
    description: String,
  },

  {
    timestamps: true,
  },
);

const News = mongoose.model('perks', perksSchema);

module.exports = News;
