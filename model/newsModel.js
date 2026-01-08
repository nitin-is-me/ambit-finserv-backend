const mongoose = require('mongoose');
const {Schema} = mongoose;

const newsSchema = new Schema(
  {
    title: String,
    date: String,
    news_link: String,
    news_type: {type: String, enum: ['press-release', 'news'], default: 'news'},
  },

  {
    timestamps: true,
  },
);

const News = mongoose.model('news', newsSchema);

module.exports = News;
