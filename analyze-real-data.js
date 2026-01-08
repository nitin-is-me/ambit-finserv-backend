const fs = require('fs');
const path = require('path');

// Load the actual CIBIL data
const dataPath = path.join(__dirname, 'live_data.json');
const fullData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const borrower =
  fullData.data.GetCustomerAssetsResponse.GetCustomerAssetsSuccess.Asset
    .TrueLinkCreditReport.Borrower;

console.log('\n' + '='.repeat(100));
console.log('ACTUAL CIBIL DATA STRUCTURE ANALYSIS');
console.log('='.repeat(100));

console.log('\n📊 CREDIT SCORE INFO:');
console.log(`   riskScore: ${borrower.CreditScore?.riskScore || 'N/A'}`);
console.log(
  `   populationRank: ${borrower.CreditScore?.populationRank || 'N/A'}`,
);
console.log(
  `   CreditScoreModel: ${borrower.CreditScore?.CreditScoreModel?.symbol || 'N/A'}`,
);

console.log('\n📋 TRADELINES:');
const tradeLines = borrower.TradeLinePartition || [];
console.log(`   Total count: ${tradeLines.length}`);

// Analyze tradelines
console.log('\n   Sample tradelines (first 10):');
tradeLines.slice(0, 10).forEach((tl, idx) => {
  const accountType = tl.accountTypeSymbol;
  const tradeline = tl.Tradeline || {};
  const creditorName = tradeline.creditorName || 'Unknown';
  const currentBalance = tradeline.currentBalance;
  const highBalance = tradeline.highBalance;
  const payStatus =
    tradeline.GrantedTrade?.PayStatusHistory?.MonthlyPayStatus || [];

  console.log(
    `   [${idx + 1}] ${creditorName} (Type: ${accountType}) | Balance: ${currentBalance} | High: ${highBalance} | Payments: ${payStatus.length}`,
  );
});

console.log('\n🔍 PAYMENT STATUS CODES FOUND:');
const statusCodes = new Set();
tradeLines.forEach(tl => {
  const payStatusHistory =
    tl.Tradeline?.GrantedTrade?.PayStatusHistory?.MonthlyPayStatus || [];
  payStatusHistory.forEach(ps => {
    statusCodes.add(ps.status);
  });
});
console.log(`   Unique codes: ${Array.from(statusCodes).sort().join(', ')}`);

console.log('\n📍 INQUIRIES:');
const inquiries = borrower.InquiryPartition || [];
console.log(`   Total count: ${inquiries.length}`);

// Analyze inquiries by date
const reportDate =
  borrower.CreditScore?.Source?.InquiryDate || '2025-12-16+05:30';
const reportDateObj = new Date(reportDate.split('+')[0] + 'Z');

console.log(`\n   Report Date: ${reportDate}`);
console.log(`\n   Sample inquiries (first 10):`);
inquiries.slice(0, 10).forEach((inq, idx) => {
  const inquiryDate = inq.Inquiry?.InquiryDate || 'N/A';
  console.log(`   [${idx + 1}] ${inquiryDate}`);
});

// Count inquiries in different periods
const threeMonthsAgo = new Date(reportDateObj);
threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

const sixMonthsAgo = new Date(reportDateObj);
sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

let inquiries3m = 0,
  inquiries6m = 0;
inquiries.forEach(inq => {
  const inquiryDate = new Date(inq.Inquiry?.InquiryDate?.split('+')[0] + 'Z');
  if (inquiryDate >= threeMonthsAgo) inquiries3m++;
  if (inquiryDate >= sixMonthsAgo) inquiries6m++;
});

console.log(`\n   Inquiries in last 3 months: ${inquiries3m}`);
console.log(`   Inquiries in last 6 months: ${inquiries6m}`);

console.log('\n💰 LOAN ANALYSIS:');

let totalSecured = 0,
  totalUnsecured = 0,
  totalLiabilities = 0,
  totalHighCredit = 0;
let accountsSMA = [];
let accountsNPA = [];

const ACCOUNT_TYPES = {
  SECURED: ['01', '02', '04', '06', '31'],
  UNSECURED: ['05', '07', '10', '17'],
};

tradeLines.forEach(tl => {
  const accountType = tl.accountTypeSymbol;
  const tradeline = tl.Tradeline || {};
  const currentBalance = parseFloat(tradeline.currentBalance) || 0;
  const highBalance = parseFloat(tradeline.highBalance) || 0;
  const creditorName = tradeline.creditorName || 'Unknown';

  totalLiabilities += currentBalance;
  totalHighCredit += highBalance;

  if (ACCOUNT_TYPES.SECURED.includes(accountType)) {
    totalSecured += currentBalance;
  } else if (ACCOUNT_TYPES.UNSECURED.includes(accountType)) {
    totalUnsecured += currentBalance;
  }

  // Check for SMA/NPA statuses
  const payStatusHistory =
    tradeline.GrantedTrade?.PayStatusHistory?.MonthlyPayStatus || [];
  payStatusHistory.forEach(ps => {
    const status = ps.status;
    if (['24', '26', '27', '29', 'SMA', 'SMA-0', 'SMA-1'].includes(status)) {
      if (!accountsSMA.includes(creditorName)) {
        accountsSMA.push(creditorName);
      }
    }
    if (['90', 'DBT', 'NPA', '903'].includes(status)) {
      if (!accountsNPA.includes(creditorName)) {
        accountsNPA.push(creditorName);
      }
    }
  });
});

console.log(`   Total Secured Loans: ₹${totalSecured}`);
console.log(`   Total Unsecured Loans: ₹${totalUnsecured}`);
console.log(`   Total Liabilities: ₹${totalLiabilities}`);
console.log(`   Total High Credit: ₹${totalHighCredit}`);

console.log(
  `\n🚩 SMA ACCOUNTS (${accountsSMA.length}): ${accountsSMA.slice(0, 5).join(', ')}`,
);
console.log(
  `🚩 NPA ACCOUNTS (${accountsNPA.length}): ${accountsNPA.slice(0, 5).join(', ')}`,
);

console.log('\n' + '='.repeat(100));
