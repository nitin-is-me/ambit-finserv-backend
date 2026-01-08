const nodemailer = require('nodemailer');

// Configure the transporter for Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    return {success: true, messageId: info.messageId};
  } catch (error) {
    return {success: false, error: error.message};
  }
};

module.exports = sendMail;
