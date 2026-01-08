const {customErrorMessages} = require('../../utils/helpers');
const PerksModel = require('../../model/perksModel');

const updatePerks = async (req, res) => {
  try {
    const {name, description, _id} = req.body;

    const updatePerk = await PerksModel.updateOne({_id}, {name, description});

    res.status(201).json({
      success: true,
      message: 'Perks updated successfully',
      data: updatePerk,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updatePerks;
