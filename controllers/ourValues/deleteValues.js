const OurValues = require('../../model/ourValuesModel');
const {customErrorMessages} = require('../../utils/helpers');

const deleteValues = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedOurValue = await OurValues.findByIdAndDelete(id);

    res.status(201).json({
      success: true,
      message: 'Our Values deleted successfully',
      data: deletedOurValue,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteValues;
