const bcrypt = require('bcrypt');
const {customErrorMessages} = require('../../utils/helpers');
const {userValidation} = require('../../validation/userValidation');
const UserModel = require('../../model/userModel');

const signUp = async (req, res) => {
  try {
    const {fullname, email, password, role} = req.body;

    const {error} = userValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const oldUser = await UserModel.findOne({email});

    if (oldUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already in use',
      });
    }

    // password hassing
    const hashedPassword = await bcrypt.hash(password, 10);

    const Newuser = new UserModel({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    await Newuser.save();

    res.json({
      success: true,
      message: 'User SignUp successfully',
      data: Newuser,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message});
  }
};

module.exports = signUp;
