const LoanApplication = require('../../model/loanApplicationsModel');

const getLoanApplicationByID = async (req, res) => {
  try {
    const {uniqueId} = req.query;

    if (!uniqueId) {
      return res.status(400).json({message: 'Unique ID is required'});
    }

    const loanApplication = await LoanApplication.findOne({uniqueID: uniqueId});

    if (!loanApplication) {
      return res.status(404).json({message: 'Loan application not found'});
    }

    res.status(200).json(loanApplication);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
};

module.exports = getLoanApplicationByID;
