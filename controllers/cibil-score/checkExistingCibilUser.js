const {customErrorMessages} = require('../../utils/helpers');
const CibilUser = require('../../model/cibilUser');

const checkExistingCibilUser = async (req, res) => {
  try {
    const {first_name, last_name, mobile_number, IdentifierId} = req.body;

    // Validate required fields
    if (!first_name || !last_name || !mobile_number || !IdentifierId) {
      return res.status(400).json({
        success: false,
        message:
          'All fields are required: first_name, last_name, mobile_number, IdentifierId (PAN)',
      });
    }

    // Check if user already exists based on PAN, mobile, first name, last name
    const existingUser = await CibilUser.findOne({
      $and: [
        {first_name: first_name},
        {last_name: last_name},
        {mobile_number: mobile_number},
        {IdentifierId: IdentifierId}, // PAN number
      ],
    });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: 'User found with same PAN, mobile, first name, and last name',
        data: {
          id: existingUser._id,
          first_name: existingUser.first_name,
          last_name: existingUser.last_name,
          email: existingUser.email,
          mobile_number: existingUser.mobile_number,
          IdentifierId: existingUser.IdentifierId,
          clientKey: existingUser.clientKey,
          PartnerCustomerId: existingUser.PartnerCustomerId,
          gender: existingUser.gender,
          dob: existingUser.dob,
          created_at: existingUser.createdAt,
          updated_at: existingUser.updatedAt,
        },
        userExists: true,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'No user found with the provided details',
        data: null,
        userExists: false,
      });
    }
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({
      success: false,
      message: message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = checkExistingCibilUser;
