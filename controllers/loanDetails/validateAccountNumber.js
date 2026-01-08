/* eslint-disable */
const moment = require('moment'); // You can use moment.js for date comparisons
const Loandetails = require('../../model/loanDetailsModel');
const NachMandate = require('../../model/nachMandateModel'); // Assuming the model is named nachMandateModel

const validateLoanAccountNumber = async (req, res) => {
  const {loan_account_number, registered_mobile} = req.body;

  if (!loan_account_number) {
    return res.status(400).json({message: 'Loan account number is required'});
  }

  try {
    const last24Hours = moment().subtract(24, 'hours').toDate();
    const nachMandateEntry = await NachMandate.findOne({
      loan_account_number,
      createdAt: {$gte: last24Hours},
    });

    if (nachMandateEntry) {
      return res.status(400).json({
        message:
          'We regret to register your request as you have already place a request for Cancel/Suspend/Revoke.Next request will be accepted post 24 hours. For further queries, write to us at info.retail@ambit.co.',
      });
    }
    const loan = await Loandetails.findOne({loan_account_number});

    if (loan) {
      if (registered_mobile) {
        if (
          loan.registered_mobile.trim().normalize().replace(/\D/g, '') ===
          registered_mobile.trim().normalize().replace(/\D/g, '')
        ) {
          return res.status(200).json({
            message: 'Loan account number and registered mobile match',
            data: loan,
          });
        } else {
          return res.status(400).json({
            message:
              'Loan account number matches but registered mobile does not match',
          });
        }
      } else {
        return res
          .status(200)
          .json({message: 'Loan account number exists', data: loan});
      }
    } else {
      return res.status(404).json({
        message:
          'The LAN entered by you does not exist in the database of valid mandate, request you to reenter the correct LAN no or you may reach out to your local branch manager or contact us at: info.retail@ambit.co',
      });
    }
  } catch (error) {
    return res.status(500).json({message: 'Server error', error});
  }
};

module.exports = validateLoanAccountNumber;
