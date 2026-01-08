const {customErrorMessages} = require('../../utils/helpers');
const AnnualReports = require('../../model/annualReportsModel');

const updateAnnualReports = async (req, res) => {
  try {
    const {title, description, _id, upload_document, year} = req.body;

    const updatedAnnualReports = await AnnualReports.updateOne(
      {_id},
      {title, description, upload_document, year},
    );

    res.status(201).json({
      success: true,
      message: 'Annual report updated successfully',
      data: updatedAnnualReports,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateAnnualReports;
