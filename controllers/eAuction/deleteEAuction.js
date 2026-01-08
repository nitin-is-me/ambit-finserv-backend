const EAuction = require('../../model/eAuctionModel');
const {customErrorMessages} = require('../../utils/helpers');

const deleteEAuction = async (req, res) => {
  try {
    const {id} = req.params;
    const eAuction = await EAuction.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'EAuction deleted successfully',
      data: eAuction,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = deleteEAuction;
