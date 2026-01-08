const PerksModel = require('../../model/perksModel');
const {customErrorMessages} = require('../../utils/helpers');

const getPerks = async (req, res) => {
  try {
    const perks = await PerksModel.find({});
    res.status(200).json({
      success: true,
      message: 'Perks fetched successfully',
      data: perks,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getPerks;
