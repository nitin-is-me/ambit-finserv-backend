const {customErrorMessages} = require('../../utils/helpers');
const CibilUser = require('../../model/cibilUser');

const updateCibilUser = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Find the existing user
    const existingUser = await CibilUser.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Extract all possible fields from request body
    const {
      first_name,
      last_name,
      email,
      mobile_number,
      cibil_score,
      population_rank,
      score_model,
      IVStatus,
      bounces_last_3_months,
      bounces_last_6_months,
      bounces_last_12_months,
      inquiries_last_1_month,
      inquiries_last_3_months,
      inquiries_last_6_months,
      maximum_delay_emi_payment,
      timely_emi_payment_percentage,
      npa_tagging,
      sma_tagging,
      write_off_tagging_last_12_months,
      credit_accounts_count,
      inquiries_count,
      high_credit_all_loans,
      total_liabilities,
      total_secured_loans,
      total_unsecured_loans,
      dob,
      gender,
      clientKey,
      PartnerCustomerId,
    } = req.body;

    // Prepare update data with only provided fields
    const updateData = {};

    // Basic Information
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email !== undefined) updateData.email = email;
    if (mobile_number !== undefined) updateData.mobile_number = mobile_number;
    if (dob !== undefined) updateData.dob = dob;
    if (gender !== undefined) updateData.gender = gender;

    // CIBIL API Keys
    if (clientKey !== undefined) updateData.clientKey = clientKey;
    if (PartnerCustomerId !== undefined)
      updateData.PartnerCustomerId = PartnerCustomerId;

    // CIBIL Score Information
    if (cibil_score !== undefined) updateData.cibil_score = cibil_score;
    if (population_rank !== undefined)
      updateData.population_rank = population_rank;
    if (score_model !== undefined) updateData.score_model = score_model;
    if (IVStatus !== undefined) updateData.IVStatus = IVStatus;

    // Credit Analysis Fields
    if (bounces_last_3_months !== undefined)
      updateData.bounces_last_3_months = bounces_last_3_months;
    if (bounces_last_6_months !== undefined)
      updateData.bounces_last_6_months = bounces_last_6_months;
    if (bounces_last_12_months !== undefined)
      updateData.bounces_last_12_months = bounces_last_12_months;
    if (inquiries_last_1_month !== undefined)
      updateData.inquiries_last_1_month = inquiries_last_1_month;
    if (inquiries_last_3_months !== undefined)
      updateData.inquiries_last_3_months = inquiries_last_3_months;
    if (inquiries_last_6_months !== undefined)
      updateData.inquiries_last_6_months = inquiries_last_6_months;
    if (npa_tagging !== undefined) updateData.npa_tagging = npa_tagging;
    if (sma_tagging !== undefined) updateData.sma_tagging = sma_tagging;
    if (write_off_tagging_last_12_months !== undefined)
      updateData.write_off_tagging_last_12_months =
        write_off_tagging_last_12_months;
    if (maximum_delay_emi_payment !== undefined)
      updateData.maximum_delay_emi_payment = maximum_delay_emi_payment;
    if (timely_emi_payment_percentage !== undefined)
      updateData.timely_emi_payment_percentage = timely_emi_payment_percentage;

    // Calculated Fields
    if (credit_accounts_count !== undefined)
      updateData.credit_accounts_count = credit_accounts_count;
    if (inquiries_count !== undefined)
      updateData.inquiries_count = inquiries_count;
    if (high_credit_all_loans !== undefined)
      updateData.high_credit_all_loans = high_credit_all_loans;
    if (total_liabilities !== undefined)
      updateData.total_liabilities = total_liabilities;
    if (total_secured_loans !== undefined)
      updateData.total_secured_loans = total_secured_loans;
    if (total_unsecured_loans !== undefined)
      updateData.total_unsecured_loans = total_unsecured_loans;

    // Update the user
    const updatedUser = await CibilUser.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Cibil User updated successfully',
      data: {
        id: updatedUser._id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        mobile_number: updatedUser.mobile_number,
        IdentifierId: updatedUser.IdentifierId,
        clientKey: updatedUser.clientKey,
        PartnerCustomerId: updatedUser.PartnerCustomerId,
        gender: updatedUser.gender,
        dob: updatedUser.dob,

        // CIBIL Score Information
        cibil_score: updatedUser.cibil_score,
        population_rank: updatedUser.population_rank,
        score_model: updatedUser.score_model,
        IVStatus: updatedUser.IVStatus,

        // Credit Analysis Fields
        bounces_last_3_months: updatedUser.bounces_last_3_months,
        bounces_last_6_months: updatedUser.bounces_last_6_months,
        bounces_last_12_months: updatedUser.bounces_last_12_months,
        inquiries_last_1_month: updatedUser.inquiries_last_1_month,
        inquiries_last_3_months: updatedUser.inquiries_last_3_months,
        inquiries_last_6_months: updatedUser.inquiries_last_6_months,
        npa_tagging: updatedUser.npa_tagging,
        sma_tagging: updatedUser.sma_tagging,
        write_off_tagging_last_12_months:
          updatedUser.write_off_tagging_last_12_months,
        maximum_delay_emi_payment: updatedUser.maximum_delay_emi_payment,
        timely_emi_payment_percentage:
          updatedUser.timely_emi_payment_percentage,

        // Calculated Fields
        credit_accounts_count: updatedUser.credit_accounts_count,
        inquiries_count: updatedUser.inquiries_count,
        high_credit_all_loans: updatedUser.high_credit_all_loans,
        total_liabilities: updatedUser.total_liabilities,
        total_secured_loans: updatedUser.total_secured_loans,
        total_unsecured_loans: updatedUser.total_unsecured_loans,

        created_at: updatedUser.createdAt,
        updated_at: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateCibilUser;
