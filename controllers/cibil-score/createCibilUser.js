const {customErrorMessages} = require('../../utils/helpers');
const CibilUser = require('../../model/cibilUser');

const addCibilUser = async (req, res) => {
  try {
    const {first_name, last_name, mobile_number, IdentifierId} = req.body;
    // console.log('Request Body:', req.body);
    // Check if user already exists based on PAN, mobile, first name, last name
    const existingUser = await CibilUser.findOne({
      $and: [
        {first_name: first_name},
        {last_name: last_name},
        {mobile_number: mobile_number},
        {IdentifierId: IdentifierId},
      ],
    });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message:
          'User already exists with same PAN, mobile, first name, and last name',
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
        isExistingUser: true,
      });
    }

    // Create new CIBIL user
    const cibilUser = await CibilUser.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Cibil User added successfully',
      data: {
        id: cibilUser._id,
        first_name: cibilUser.first_name,
        last_name: cibilUser.last_name,
        email: cibilUser.email,
        mobile_number: cibilUser.mobile_number,
        IdentifierId: cibilUser.IdentifierId,
        clientKey: cibilUser.clientKey,
        PartnerCustomerId: cibilUser.PartnerCustomerId,
        gender: cibilUser.gender,
        dob: cibilUser.dob,
        created_at: cibilUser.createdAt,
        updated_at: cibilUser.updatedAt,
      },
      isExistingUser: false,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addCibilUser;
