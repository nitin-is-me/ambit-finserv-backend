const Disclosures = require('../../model/disclosuresModel');
const {customErrorMessages} = require('../../utils/helpers');

const getSingleDisclosure = async (req, res) => {
  try {
    const {id} = req.params;
    const disclosure = await Disclosures.findById(id);
    res.status(200).json({
      success: true,
      message: 'Disclosure fetched successfully',
      data: disclosure,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getSingleDisclosure;
