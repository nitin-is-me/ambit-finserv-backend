// Required Modules
const {customErrorMessages} = require('../../utils/helpers');
const sendMail = require('../../utils/mailer');

const pushEmail = async (req, res) => {
  try {
    const {email, name, date, loan_no, link} = req.body;

    const subject =
      'Request for NACH Creation/Registration with Ambit Finvest Pvt Ltd';
    const message = `
       Dear ${name},

       We refer to your request dated ${date}, regarding your loan account no. ${loan_no}

       We would like to inform you that you have initiated an E-Mandate registration with Ambit Finvest Pvt Ltd. Please click here ${link} to proceed.
      

      For further queries or clarifications, please feel free to call us at +9115998000 or write to us at info.retail@ambit.co 
      Sincerely, 
      Customer Service Team, 
      Ambit Finvest Private Limited
      `;

    const emailResponse = await sendMail(email, subject, message);

    if (!emailResponse.success) {
      throw new Error(`Email not sent: ${emailResponse.error}`);
    }

    res.status(200).json({
      success: true,
      message: 'Email sent successfully.',
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(400).json({success: false, message: message});
  }
};

module.exports = pushEmail;
