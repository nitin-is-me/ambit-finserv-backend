const {customErrorMessages} = require('../../utils/helpers');
const Address = require('../../model/addressModel');

const getAddress = async (req, res) => {
  try {
    const address = await Address.find();
    res.status(200).json({
      success: true,
      message: 'All Address fetched successfully',
      data: address,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getAddress;
