const mongoose = require('mongoose');
const {Schema} = mongoose;

const funAtWorkSchema = new Schema(
  {
    title: String,
    description: String,
    image: [{url: String, description: String}],
  },
  {
    timestamps: true,
  },
);

const FunAtWork = mongoose.model('funAtWork', funAtWorkSchema);

module.exports = FunAtWork;
