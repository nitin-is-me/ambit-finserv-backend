const mongoose = require('mongoose');
const {Schema} = mongoose;

const blogsSchema = new Schema(
  {
    image: String,
    title: String,
    date: String,
    description: String,
    category: String,
  },
  {
    timestamps: true,
  },
);

const Blogs = mongoose.model('blogs', blogsSchema);

module.exports = Blogs;
