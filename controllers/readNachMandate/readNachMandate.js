/* eslint-disable */
const {S3Client, GetObjectCommand} = require('@aws-sdk/client-s3');
const xlsx = require('xlsx');
const LoanDetails = require('../../model/loanDetailsModel');

async function listAllObjects(bucketName) {
  // Create an S3 client with credentials
  const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
      accessKeyId: process.env.IM_AWS_ACCESS_KEY_FOR_EXCEL,
      secretAccessKey: process.env.IM_AWS_SECRET_KEY_FOR_EXCEL,
    },
  });

  try {
    const params = {
      Bucket: bucketName,
      Key: 'NACH Details.xlsx',
    };

    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    const stream = response.Body;
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Parse the Excel data
    const workbook = xlsx.read(buffer, {type: 'buffer'});
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    const bulkOps = jsonData.map(data => {
      return {
        updateOne: {
          filter: {loan_account_number: data['Loan Account Number']},
          update: {
            $set: {
              customer_name: data['Customer Name'],
              emi_due_date: new Date(
                (data['EMI due date'] - (25567 + 2)) * 86400 * 1000,
              ),
              // next_emi_due_date: new Date(
              //   (data['Next EMI Due date'] - (25567 + 2)) * 86400 * 1000,
              // ),
              bank_name: data['Bank Name'],
              bank_account_no: data['Bank Account no'],
              bank_ifsc_code: data['Bank IFSC code'],
              bank_micr_no: data['Bank MICR no'],
              bank_branch: data['Bank Branch'],
              registered_mobile: data['Registered Mobile'],
              registered_email: data['Registered Email'],
              installment_amount: data['Installment Amount'],
              sanction_amount: data['Sanction Amount'],
              umrn: data['UMRN'],
              nach_status: data['NACH status'],
            },
          },
          upsert: true,
        },
      };
    });

    // return bulkOps
    await LoanDetails.bulkWrite(bulkOps);
  } catch (error) {
    console.log(error, 'setNEW ERROR');
  }
}

// const readResponse = async (req, res) => {
//   try {
//     const result = await listAllObjects('webisdom-bots');

//     res.send({
//       result,
//     });
//   } catch (e) {
//     console.log(e, 'SETERROR');
//     res.send({
//       e,
//     });
//   }
// };

module.exports = listAllObjects;
