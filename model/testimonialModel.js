const mongoose = require('mongoose');
const {Schema} = mongoose;

const testimonialSchema = new Schema(
  {
    image: String,
    title: String,
    stars: String,
    description: String,
    date: String,
  },
  {
    timestamps: true,
  },
);

const Testimonial = mongoose.model('testimonial', testimonialSchema);

module.exports = Testimonial;
