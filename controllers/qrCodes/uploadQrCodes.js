/* eslint-disable */
const reader = require('xlsx');
const QRCODEMODEL = require('../../model/qrCodesModel');

const validateSheet = sheet => {
  const requiredColumns = [
    'LOAN_ID',
    'CUSTOMER_NAME',
    'PRODUCT_NAME',
    'System Tagging',
    'QR code Link',
  ];

  const sheetColumns = Object.keys(sheet[0]);
  let colomsOk = false;

  // Check if all required columns are present
  if (requiredColumns.length === sheetColumns.length) {
    colomsOk = requiredColumns.every(col => sheetColumns.includes(col));
  } else {
    colomsOk = false;
  }

  return colomsOk; // Only check if the columns are present, not the data
};

const uploadLoanDetails = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const file = req.files ? req.files.file : null;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const data = reader.read(file?.data);
    const sheet = data.SheetNames[0];
    const dataArr = reader.utils.sheet_to_json(data.Sheets[sheet]);

    // Validate the sheet structure
    if (!validateSheet(dataArr)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format',
      });
    }

    const loandetailsData = dataArr.map(row => {
      return {
        loan_id: row['LOAN_ID'] || '',
        customer_name: row['CUSTOMER_NAME'] || '',
        product_name: row['PRODUCT_NAME'] || '',
        system_tagging: row['System Tagging'] || '',
        qr_code_link: row['QR code Link'] || '',
      };
    });

    // Insert the data into the database
    const result = await QRCODEMODEL.insertMany(loandetailsData);
    res.status(201).json({
      success: true,
      message: 'Loan Details uploaded successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = uploadLoanDetails;
