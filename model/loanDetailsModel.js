const mongoose = require('mongoose');
const {Schema} = mongoose;

const loanDetailsSchema = new Schema(
  {
    loan_account_number: String,
    customer_name: String,
    emi_due_date: Date,
    next_emi_due_date: Date,
    bank_name: String,
    bank_account_no: Number,
    bank_ifsc_code: String,
    bank_micr_no: String,
    bank_branch: String,
    registered_mobile: String,
    registered_email: String,
    installment_amount: String,
    sanction_amount: String,
    umrn: String,
    nach_status: String,
  },
  {
    timestamps: true,
  },
);

const LoanDetails = mongoose.model('loanDetails', loanDetailsSchema);

module.exports = LoanDetails;
