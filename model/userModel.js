const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema(
  {
    fullname: String,
    email: String,
    password: String,
    image: String,
    role: {
      type: String,
      default: 'user',
      enum: [
        'admin',
        'eauction_user',
        'regulatory_user',
        'mandate_user',
        'career_user',
        'qr_code_access',
        'loan_application_access',
        'affiliate_marketing',
      ],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('user', userSchema);

module.exports = User;
