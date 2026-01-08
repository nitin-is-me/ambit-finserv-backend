const OurValues = require('../../model/ourValuesModel');
const {customErrorMessages} = require('../../utils/helpers');

const getSingleValue = async (req, res) => {
  try {
    const {id} = req.params;
    const ourValue = await OurValues.findById(id);

    res.status(201).json({
      success: true,
      message: 'Our Values fetched successfully',
      data: ourValue,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getSingleValue;
