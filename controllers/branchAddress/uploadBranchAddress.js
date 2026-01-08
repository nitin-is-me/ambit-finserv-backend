const reader = require('xlsx');
const branchAddress = require('../../model/branchAddressModel');

const validateSheet = sheet => {
  const requiredColumns = ['Branch Location', 'State', 'Branch Address'];
  const sheetColumns = Object.keys(sheet[0]);
  let colomsOk = false;
  let dataOk = false;
  if (requiredColumns.length === sheetColumns.length) {
    colomsOk = requiredColumns.every(col => sheetColumns.includes(col));
  } else {
    colomsOk = false;
  }
  dataOk = sheet.every(
    row => row['Branch Location'] && row.State && row['Branch Address'],
  );

  return dataOk && colomsOk;
};

const uploadBranchAddress = async (req, res) => {
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
    if (!validateSheet(dataArr)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format',
      });
    }
    const branchAddressData = dataArr.map(row => ({
      branch_location: row['Branch Location'],
      state: row.State,
      branch_address: row['Branch Address'],
    }));
    const result = await branchAddress.insertMany(branchAddressData);
    res.status(201).json({
      success: true,
      message: 'Branch Address uploaded successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = uploadBranchAddress;
