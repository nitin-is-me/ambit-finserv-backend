const fs = require('fs');
const path = require('path');

// Load actual CIBIL data
const actualDataPath = path.join(__dirname, 'test-data-actual-bounces.json');
const actualData = JSON.parse(fs.readFileSync(actualDataPath, 'utf8'));

const borrower = actualData.data.TrueLinkCreditReport.Borrower;
const reportDate = '2025-12-16+05:30';

console.log('\n🔍 DEBUG: Bounce Counting Logic');
console.log('='.repeat(100));

const threeMonthsAgo = new Date(reportDate.split('+')[0]);
threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

const sixMonthsAgo = new Date(reportDate.split('+')[0]);
sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

const twelveMonthsAgo = new Date(reportDate.split('+')[0]);
twelveMonthsAgo.setDate(twelveMonthsAgo.getDate() - 365);

console.log(`Report Date: ${reportDate}`);
console.log(`3 Months Ago: ${threeMonthsAgo.toISOString()}`);
console.log(`6 Months Ago: ${sixMonthsAgo.toISOString()}`);
console.log(`12 Months Ago: ${twelveMonthsAgo.toISOString()}`);

let bouncesLast3 = 0;
let bouncesLast6 = 0;
let bouncesLast12 = 0;

borrower.TradeLinePartition.forEach((tradelinePartition, idx) => {
  const tradeline = tradelinePartition.Tradeline;
  const grantedTrade = tradeline.GrantedTrade || {};
  const payStatusHistory = grantedTrade.PayStatusHistory || {};
  const monthlyPayStatusArray = payStatusHistory.MonthlyPayStatus || [];

  console.log(`\n📌 Account ${idx + 1}: ${tradeline.creditorName}`);
  console.log('-'.repeat(100));

  monthlyPayStatusArray.forEach(payStatus => {
    const status = payStatus.status || '0';
    const statusNum = parseInt(status);
    const dateStr = payStatus.date;
    const paymentDate = new Date(dateStr.split('+')[0]);

    console.log(
      `   Date: ${dateStr} | Status: ${status} | StatusNum: ${statusNum} | Parsed: ${paymentDate.toISOString()}`,
    );

    if (statusNum !== 0) {
      console.log(`      ✓ Non-zero status detected`);

      if (paymentDate >= threeMonthsAgo) {
        console.log(
          `      ✓ Within 3 months (${paymentDate.getTime()} >= ${threeMonthsAgo.getTime()})`,
        );
        bouncesLast3++;
      }
      if (paymentDate >= sixMonthsAgo) {
        console.log(
          `      ✓ Within 6 months (${paymentDate.getTime()} >= ${sixMonthsAgo.getTime()})`,
        );
        bouncesLast6++;
      }
      if (paymentDate >= twelveMonthsAgo) {
        console.log(
          `      ✓ Within 12 months (${paymentDate.getTime()} >= ${twelveMonthsAgo.getTime()})`,
        );
        bouncesLast12++;
      }
    } else {
      console.log(`      ✗ On-time payment (status 0)`);
    }
  });
});

console.log('\n' + '='.repeat(100));
console.log('FINAL BOUNCE COUNT:');
console.log('-'.repeat(100));
console.log(`Bounces Last 3 Months:  ${bouncesLast3}`);
console.log(`Bounces Last 6 Months:  ${bouncesLast6}`);
console.log(`Bounces Last 12 Months: ${bouncesLast12}`);
console.log('='.repeat(100));
