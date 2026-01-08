const mongoose = require('mongoose');
const {Schema} = mongoose;

const faqSchema = new Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  },
);

const Faq = mongoose.model('faq', faqSchema);

module.exports = Faq;
