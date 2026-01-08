const reader = require('xlsx');
const Career = require('../../model/careerModel');

const validateSheet = sheet => {
  const requiredColumns = [
    'Location',
    'State',
    'Position',
    'Product',
    'Department',
    'Experience Required',
    'Education',
    'JD',
    'Skill Set Required',
  ];
  const sheetColumns = Object.keys(sheet[0]);
  let colomsOk = false;
  let dataOk = false;
  if (requiredColumns.length === sheetColumns.length) {
    colomsOk = requiredColumns.every(col => sheetColumns.includes(col));
  } else {
    colomsOk = false;
  }
  dataOk = sheet.every(
    row =>
      row.Location &&
      row.State &&
      row.Position &&
      row.Product &&
      row.Department &&
      row['Experience Required'] &&
      row.Education &&
      row.JD &&
      row['Skill Set Required'],
  );

  return dataOk && colomsOk;
};

const uploadCareer = async (req, res) => {
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
    const careerData = dataArr.map(row => ({
      location: row.Location,
      state: row.State,
      position: row.Position,
      product: row.Product,
      department: row.Department,
      experience_required: row['Experience Required'],
      education: row.Education,
      jd: row.JD,
      skill_set_required: row['Skill Set Required'],
    }));
    const result = await Career.insertMany(careerData);
    res.status(201).json({
      success: true,
      message: 'Careers uploaded successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = uploadCareer;
