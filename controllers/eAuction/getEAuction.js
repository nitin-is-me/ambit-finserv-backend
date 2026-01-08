const EAuction = require('../../model/eAuctionModel');
const {customErrorMessages} = require('../../utils/helpers');

const getEAuction = async (req, res) => {
  try {
    const eAuction = await EAuction.find();

    res.status(200).json({
      success: true,
      message: 'All EAuction',
      data: eAuction,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getEAuction;
