const EAuction = require('../../model/eAuctionModel');
const {customErrorMessages} = require('../../utils/helpers');

const singleEAuction = async (req, res) => {
  try {
    const {id} = req.params;
    const eAuction = await EAuction.findById(id);

    res.status(200).json({
      success: true,
      message: 'EAuction fetched successfully',
      data: eAuction,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = singleEAuction;
