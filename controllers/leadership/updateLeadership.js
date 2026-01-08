const {customErrorMessages} = require('../../utils/helpers');
const Leadership = require('../../model/leadershipModel');

const updateLeadership = async (req, res) => {
  try {
    const {name, image, description, designation, _id} = req.body;

    const updatedLeadership = await Leadership.updateOne(
      {_id},
      {name, image, description, designation},
    );

    res.status(201).json({
      success: true,
      message: 'Leadership updated successfully',
      data: updatedLeadership,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateLeadership;
