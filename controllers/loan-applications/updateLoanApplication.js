const {customErrorMessages} = require('../../utils/helpers');
const LoanApplication = require('../../model/loanApplicationsModel');

const updateLoanApplications = async (req, res) => {
  try {
    const {
      lead_id,
      first_name,
      middle_name,
      bank_statement,
      business_registration_proof,
      gst_certificate,
      is_gst_registered,
      uniqueID,
      last_name,
      email,
      dob,
      mobile_number,
      pan_number,
      aadhar_number,
      Applicant_Aadhar_Card,
      CoApplicant_Aadhar_Card,
      Applicant_PAN_Card,
      CoApplicant_PAN_Card,
      oneYear_Bank_Statement,
      ownershipDocument,
      password,
      GST_Returns,
      Business_Registration_Document,
      dl_number,
      pin_code,
      city_name,
      state_name,
      loan_amount,
      loan_duration,
      resident_ownership,
      customer_profile,
      business_name,
      business_pincode,
      last_twelve_month_sales,
      constitution,
      number_of_years_in_business,
      loan_type,
      utm_source,
      utm_campaign,
      utm_medium,
    } = req.body;

    if (!uniqueID) {
      return res.status(400).json({success: false, message: 'ID is required'});
    }

    const updateloanapplications = await LoanApplication.updateOne(
      {uniqueID: uniqueID},
      {
        lead_id,
        first_name,
        middle_name,
        last_name,
        email,
        dob,
        bank_statement,
        business_registration_proof,
        gst_certificate,
        is_gst_registered,
        mobile_number,
        pan_number,
        aadhar_number,
        Applicant_Aadhar_Card,
        CoApplicant_Aadhar_Card,
        Applicant_PAN_Card,
        CoApplicant_PAN_Card,
        oneYear_Bank_Statement,
        ownershipDocument,
        password,
        GST_Returns,
        Business_Registration_Document,
        dl_number,
        pin_code,
        city_name,
        state_name,
        loan_amount,
        loan_duration,
        resident_ownership,
        customer_profile,
        business_name,
        business_pincode,
        last_twelve_month_sales,
        constitution,
        number_of_years_in_business,
        loan_type,
        utm_source,
        utm_campaign,
        utm_medium,
      },
    );

    res.status(201).json({
      success: true,
      message: 'Loan applications updated successfully',
      data: updateloanapplications,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateLoanApplications;
