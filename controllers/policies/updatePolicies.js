const {customErrorMessages} = require('../../utils/helpers');
const Policies = require('../../model/policiesModel');

const updatePolicy = async (req, res) => {
  try {
    const {title, description, _id, upload_document} = req.body;

    const updatedPolicy = await Policies.updateOne(
      {_id},
      {title, description, upload_document},
    );

    res.status(201).json({
      success: true,
      message: 'Policy updated successfully',
      data: updatedPolicy,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updatePolicy;
