const {customErrorMessages} = require('../../utils/helpers');
const Compliances = require('../../model/compliancesModel');

const updateCompliances = async (req, res) => {
  try {
    const {title, description, _id, upload_document, year} = req.body;

    const updatedCompliances = await Compliances.updateOne(
      {_id},
      {title, description, upload_document, year},
    );

    res.status(201).json({
      success: true,
      message: 'listing compliances updated successfully',
      data: updatedCompliances,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateCompliances;
