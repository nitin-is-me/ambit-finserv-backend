const User = require('../../model/userModel');
const {customErrorMessages} = require('../../utils/helpers');
const {updateProfileValidation} = require('../../validation/userValidation');

const updateProfile = async (req, res) => {
  try {
    await updateProfileValidation.validateAsync(req.body);
    const {id} = req;

    const userProfile = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select('-password');

    res.status(201).json({
      success: true,
      message: 'Profile updated successfully',
      data: userProfile,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateProfile;
