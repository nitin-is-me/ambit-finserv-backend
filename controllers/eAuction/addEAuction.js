const EAuction = require('../../model/eAuctionModel');
const {customErrorMessages} = require('../../utils/helpers');
const {eAuctionAddValidation} = require('../../validation/eAuctionValidation');

const addEAuction = async (req, res) => {
  try {
    const data = req.body;
    await eAuctionAddValidation.validateAsync(data);
    const eAuction = await EAuction.create(data);

    res.status(200).json({
      success: true,
      message: 'EAuction added successfully',
      data: eAuction,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = addEAuction;
