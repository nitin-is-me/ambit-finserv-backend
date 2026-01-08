const mongoose = require('mongoose');
const {Schema} = mongoose;

const newsLetterSubscription = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create a unique index on email field
newsLetterSubscription.index({email: 1}, {unique: true});

const NewsletterSubscription = mongoose.model(
  'newsLetter_subscription',
  newsLetterSubscription,
);

module.exports = NewsletterSubscription;
