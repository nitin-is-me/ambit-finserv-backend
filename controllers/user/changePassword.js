const bcrypt = require('bcrypt');
const User = require('../../model/userModel');
const {customErrorMessages} = require('../../utils/helpers');
const {changePasswordValidation} = require('../../validation/userValidation');

const changePassword = async (req, res) => {
  try {
    await changePasswordValidation.validateAsync(req.body);
    const {id} = req;
    const {old_password, new_password} = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found!',
      });
    }

    const passwordValid = await bcrypt.compare(old_password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password does not match',
      });
    }

    const new_hashed_Password = await bcrypt.hash(new_password, 10);

    const userPassword = await User.findByIdAndUpdate(
      id,
      {
        password: new_hashed_Password,
      },
      {new: true},
    ).select('-password');

    res.status(201).json({
      success: true,
      message: 'Password changed successfully',
      data: userPassword,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = changePassword;
