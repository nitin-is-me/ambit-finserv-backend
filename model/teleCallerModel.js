const mongoose = require('mongoose');

const teleCallerSchema = new mongoose.Schema(
  {
    mobile_number: {
      type: String,
      required: true,
      trim: true,
    },
    disposition: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['call', 'facebook'],
      default: 'call',
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
teleCallerSchema.index({mobile_number: 1, date: 1});
teleCallerSchema.index({type: 1});
teleCallerSchema.index({createdAt: -1});

module.exports = mongoose.model('TeleCaller', teleCallerSchema);
