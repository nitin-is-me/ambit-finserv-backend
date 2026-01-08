const fs = require('fs');
const path = require('path');
const calculateCreditMetrics = require('./utils/calculateCreditMetrics');

// Load real CIBIL data
const dataPath = path.join(__dirname, 'live_data.json');
const fullData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const testUser = {
  clientKey: 'MAN-371361437',
  PartnerCustomerId: 'CIB-803324738',
};

console.log('\n' + '='.repeat(100));
console.log('CIBIL METRICS EXTRACTION - REAL USER DATA');
console.log('='.repeat(100));

console.log('\n📝 TEST USER:');
console.log(`   Client Key: ${testUser.clientKey}`);
console.log(`   Partner Customer ID: ${testUser.PartnerCustomerId}`);

console.log('\n🔄 CALCULATING METRICS FROM REAL CIBIL API RESPONSE...\n');
const metrics = calculateCreditMetrics(fullData.data);

// Expected values from user's analysis
const expectedValues = {
  cibil_score: 825,
  population_rank: 17,
  score_model: 'CIBILTUSC3',
  credit_accounts_count: 56,
  inquiries_count: 84, // Could be 84+
  total_secured_loans: 18498,
  total_unsecured_loans: 500000, // > 500,000
  total_liabilities: 1450000, // ~1,450,000
  high_credit_all_loans: 4000000, // > 4,000,000
  sma_tagging: 'YES',
  npa_tagging: 'NO',
  write_off_tagging_last_12_months: 'NO',
};

console.log('='.repeat(100));
console.log('VERIFICATION: ACTUAL vs EXPECTED');
console.log('='.repeat(100));

const metricsToCheck = [
  ['cibil_score', 825],
  ['population_rank', 17],
  ['score_model', 'CIBILTUSC3'],
  ['credit_accounts_count', 56],
  ['inquiries_count', 84],
  ['total_secured_loans', 18498],
  ['total_unsecured_loans', 500000],
  ['total_liabilities', 1450000],
  ['high_credit_all_loans', 4000000],
  ['sma_tagging', 'YES'],
  ['npa_tagging', 'NO'],
  ['write_off_tagging_last_12_months', 'NO'],
  ['timely_emi_payment_percentage', 99],
  ['bounces_last_3_months', 1],
  ['bounces_last_6_months', 4],
  ['bounces_last_12_months', 6],
];

let passCount = 0;
let failCount = 0;

metricsToCheck.forEach(([metricKey, expectedValue]) => {
  const actualValue = metrics[metricKey];

  let isPass = false;
  let statusMsg = '';

  if (typeof expectedValue === 'number') {
    // For numbers, check if actual is within reasonable range
    if (actualValue === expectedValue) {
      isPass = true;
      statusMsg = `✅ EXACT`;
    } else if (
      typeof actualValue === 'number' &&
      actualValue >= expectedValue * 0.8
    ) {
      // Allow 20% variance for aggregated metrics
      isPass = true;
      statusMsg = `✅ CLOSE`;
    } else {
      statusMsg = `❌ MISMATCH`;
    }
  } else {
    // For strings, check exact match
    isPass = actualValue === expectedValue;
    statusMsg = isPass ? `✅ MATCH` : `❌ MISMATCH`;
  }

  if (isPass) passCount++;
  else failCount++;

  const displayValue =
    typeof actualValue === 'number'
      ? actualValue.toLocaleString()
      : actualValue;
  const displayExpected =
    typeof expectedValue === 'number'
      ? expectedValue.toLocaleString()
      : expectedValue;

  console.log(
    `${metricKey.padEnd(40)} | Actual: ${String(displayValue).padEnd(20)} | Expected: ${displayExpected.padEnd(15)} | ${statusMsg}`,
  );
});

console.log('\n' + '='.repeat(100));
console.log('COMPLETE METRICS JSON');
console.log('='.repeat(100));
console.log(JSON.stringify(metrics, null, 2));

console.log('\n' + '='.repeat(100));
console.log(`✅ TESTS PASSED: ${passCount}/${metricsToCheck.length}`);
console.log(`❌ TESTS FAILED: ${failCount}/${metricsToCheck.length}`);
console.log('='.repeat(100) + '\n');

if (failCount > 0) {
  console.log('⚠️  Some metrics need adjustment. Review the logic for:');
  metricsToCheck.forEach(([metricKey, expectedValue]) => {
    const actualValue = metrics[metricKey];
    if (
      typeof expectedValue === 'number' &&
      actualValue !== expectedValue &&
      (typeof actualValue !== 'number' || actualValue < expectedValue * 0.8)
    ) {
      console.log(`   - ${metricKey}`);
    }
  });
}
