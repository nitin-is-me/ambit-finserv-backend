const {customErrorMessages} = require('../../utils/helpers');
const Disclosure = require('../../model/disclosuresModel');

const updateDisclosures = async (req, res) => {
  try {
    const {title, description, _id, upload_document, type} = req.body;

    const update = await Disclosure.updateOne(
      {_id},
      {title, description, upload_document, type},
    );

    res.status(201).json({
      success: true,
      message: 'listing compliances updated successfully',
      data: update,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateDisclosures;
