const EAuction = require('../../model/eAuctionModel');
const {customErrorMessages} = require('../../utils/helpers');
const {eAuctionEditValidation} = require('../../validation/eAuctionValidation');

const editEAuction = async (req, res) => {
  try {
    const data = req.body;
    await eAuctionEditValidation.validateAsync(data);
    const {id} = req.params;
    const eAuction = await EAuction.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: 'EAuction updated successfully',
      data: eAuction,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = editEAuction;
