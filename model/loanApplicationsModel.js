const mongoose = require('mongoose');
const {Schema} = mongoose;

const loanApplicationSchema = new Schema(
  {
    uniqueID: {
      type: String,
      unique: true,
    },
    lead_id: String,
    first_name: String,
    middle_name: String,
    last_name: String,
    email: String,
    dob: String,
    mobile_number: String,
    pan_number: String,
    aadhar_number: String,
    Applicant_Aadhar_Card: String,
    CoApplicant_Aadhar_Card: String,
    Applicant_PAN_Card: String,
    CoApplicant_PAN_Card: String,
    oneYear_Bank_Statement: String,
    ownershipDocument: String,
    password: String,
    GST_Returns: String,
    Business_Registration_Document: String,
    dl_number: String,
    pin_code: String,
    city_name: String,
    state_name: String,
    loan_amount: String,
    loan_duration: String,
    resident_ownership: String,
    customer_profile: String,
    business_name: String,
    business_pincode: String,
    last_twelve_month_sales: String,
    constitution: String,
    number_of_years_in_business: String,
    business_annual_turnover: String,
    ownership_proof: String,
    bank_statement: String,
    business_registration_proof: String,
    gst_certificate: String,
    is_gst_registered: String,
    income: String,
    loan_type: {
      type: String,
      enum: [
        'Udyam Loan',
        'Vyapar Loan',
        'Used Car Loan',
        'Used Commercial Vehicle Loan',
      ],
    },
    utm_source: String,
    utm_campaign: String,
    utm_medium: String,
  },
  {
    timestamps: true,
  },
);

const LoanApplication = mongoose.model(
  'loan_application',
  loanApplicationSchema,
);

module.exports = LoanApplication;
