const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./live_data.json'));
const tlp =
  data.data.GetCustomerAssetsResponse.GetCustomerAssetsSuccess.Asset
    .TrueLinkCreditReport.TradeLinePartition;

const statusCounts = {};
let totalPayments = 0;
let onTimePayments = 0;
let xxxCount = 0;
let stdCount = 0;

tlp.forEach(tl => {
  const mps =
    tl.Tradeline?.GrantedTrade?.PayStatusHistory?.MonthlyPayStatus || [];
  let mpsArray = Array.isArray(mps) ? mps : Object.values(mps);

  mpsArray.forEach(ps => {
    const status = ps.status || '0';
    statusCounts[status] = (statusCounts[status] || 0) + 1;

    if (status === '0') {
      onTimePayments++;
      totalPayments++;
    } else if (status === 'XXX') {
      xxxCount++;
    } else if (status === 'STD') {
      stdCount++;
    } else {
      totalPayments++;
    }
  });
});

console.log('\n📊 PAYMENT STATUS DISTRIBUTION:');
console.log('='.repeat(60));
console.log('\nStatus Code -> Count:');
Object.entries(statusCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([status, count]) => {
    const pct = (
      (count / Object.values(statusCounts).reduce((a, b) => a + b)) *
      100
    ).toFixed(2);
    console.log(`  "${status}": ${count} (${pct}%)`);
  });

console.log('\n' + '='.repeat(60));
console.log('CALCULATION:');
console.log('='.repeat(60));
console.log(`  XXX (no data) count:       ${xxxCount}`);
console.log(`  STD (standard) count:      ${stdCount}`);
console.log(`  Total actual payments:     ${totalPayments}`);
console.log(`  On-time (0) payments:      ${onTimePayments}`);
console.log(`  Non-timely payments:       ${totalPayments - onTimePayments}`);
console.log(
  `\n  Percentage: ${((onTimePayments / totalPayments) * 100).toFixed(2)}%`,
);
console.log('='.repeat(60));
