const {customErrorMessages} = require('../../utils/helpers');
const Disclosure = require('../../model/disclosuresModel');

const deleteDisclosures = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const disclosures = await Disclosure.findByIdAndDelete(id);

    if (!disclosures) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Disclosure deleted successfully',
      data: disclosures,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteDisclosures;
