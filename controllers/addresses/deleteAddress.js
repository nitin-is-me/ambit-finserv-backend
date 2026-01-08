const {customErrorMessages} = require('../../utils/helpers');
const Address = require('../../model/addressModel');

const deleteAddress = async (req, res) => {
  try {
    const {id} = req.params;
    const address = await Address.findByIdAndDelete(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: address,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteAddress;
