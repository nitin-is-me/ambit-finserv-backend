/* eslint-disable no-console */
const {uploadFile} = require('../../utils/uploadFile');

const uploadPDF = async (req, res) => {
  try {
    const {base64String} = req.body;
    const base64Data = base64String.replace(
      /^data:application\/pdf;base64,/,
      '',
    );
    const file = Buffer.from(base64Data, 'base64');
    const key = `pdfs/${Date.now()}.pdf`; // Define your S3 key for PDF files
    const uploadParams = {
      key: key,
      file: file,
      contentEncoding: 'base64',
      contentType: 'application/pdf',
    };
    uploadFile(
      uploadParams,
      url => {
        if (url) {
          res.status(200).send({
            status: 'success',
            message: 'PDF uploaded successfully',
            data: url,
          });
        }
      },
      err => {
        res.status(200).send({status: 'failed', message: err?.message});
      },
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: error.message});
  }
};

module.exports = uploadPDF;
