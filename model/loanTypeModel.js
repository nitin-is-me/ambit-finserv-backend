const mongoose = require('mongoose');
const {Schema} = mongoose;

const loanTypeSchema = new Schema(
  {
    title: String,
    title2: String,
    description: String,
    name: String,
  },
  {
    timestamps: true,
  },
);

const LoanType = mongoose.model('loanType', loanTypeSchema);

module.exports = LoanType;
