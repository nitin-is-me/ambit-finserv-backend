const OurValues = require('../../model/ourValuesModel');
const {customErrorMessages} = require('../../utils/helpers');

const getValues = async (req, res) => {
  try {
    const ourValues = await OurValues.find({});
    res.status(201).json({
      success: true,
      message: 'Our Values fetched successfully',
      data: ourValues,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getValues;
