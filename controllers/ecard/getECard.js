const ECards = require('../../model/eCard');
const {customErrorMessages} = require('../../utils/helpers');

const getECards = async (req, res) => {
  try {
    const loanapplications = await ECards.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'e-cards fetched successfully',
      data: loanapplications,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getECards;
