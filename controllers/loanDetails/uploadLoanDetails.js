const reader = require('xlsx');
const LoanDetails = require('../../model/loanDetailsModel');

const validateSheet = sheet => {
  const requiredColumns = [
    'Loan Account Number',
    'Customer Name',
    'EMI due date',
    'Bank Name',
    'Bank Account no',
    'Bank IFSC code',
    'Bank MICR no',
    'Bank Branch',
    'Registered Mobile',
    'Registered Email',
    'Installment Amount',
    'Sanction Amount',
    'UMRN',
    'NACH status',
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
      row['Loan Account Number'] &&
      row['Customer Name'] &&
      row['EMI due date'] &&
      row['Bank Name'] &&
      row['Bank Account no'] &&
      row['Bank IFSC code'] &&
      row['Bank MICR no'] &&
      row['Bank Branch'] &&
      row['Registered Mobile'] &&
      row['Registered Email'] &&
      row['Installment Amount'] &&
      row['Sanction Amount'] &&
      row.UMRN &&
      row['NACH status'],
  );

  return dataOk && colomsOk;
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
    if (!validateSheet(dataArr)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format',
      });
    }

    const loandetailsData = dataArr.map(row => ({
      loan_account_number: row['Loan Account Number'],
      customer_name: row['Customer Name'],
      emi_due_date: row['EMI due date'],
      bank_name: row['Bank Name'],
      bank_account_no: row['Bank Account no'],
      bank_ifsc_code: row['Bank IFSC code'],
      bank_micr_no: row['Bank MICR no'],
      bank_branch: row['Bank Branch'],
      registered_mobile: row['Registered Mobile'],
      registered_email: row['Registered Email'],
      installment_amount: row['Installment Amount'],
      sanction_amount: row['Sanction Amount'],
      umrn: row.UMRN,
      nach_status: row['NACH status'],
    }));
    const result = await LoanDetails.insertMany(loandetailsData);
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
