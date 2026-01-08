const mongoose = require('mongoose');
const {Schema} = mongoose;

const loansSchema = new Schema(
  {
    overview: {
      title: String,
      count: Number,
    },
    features: [
      {
        icon: String,
        feature_name: String,
      },
    ],
    eligibility: [
      {
        criteria: String,
        requirement: String,
      },
    ],
    required_documents: [
      {
        icon: String,
        document_name: String,
      },
    ],
    loan_type: {
      type: String,
      enum: ['Udyam Loan', 'Vyapar Loan', 'Parivahan Loan'],
    },
  },
  {
    timestamps: true,
  },
);

const Loans = mongoose.model('loans', loansSchema);

module.exports = Loans;
