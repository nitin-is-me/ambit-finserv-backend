/**
 * Test file to validate calculateCreditMetrics function
 * Tests against live_data.json
 */

const calculateCreditMetrics = require('./utils/calculateCreditMetrics');
const fs = require('fs');
const path = require('path');

// Load live data
const liveDataPath = path.join(__dirname, './live_data.json');
const liveData = JSON.parse(fs.readFileSync(liveDataPath, 'utf8'));

console.log('='.repeat(80));
console.log('TESTING calculateCreditMetrics FUNCTION');
console.log('='.repeat(80));

// Run calculation
const metrics = calculateCreditMetrics(liveData.data);

console.log('\n' + '='.repeat(80));
console.log('CALCULATED METRICS');
console.log('='.repeat(80));
console.log(JSON.stringify(metrics, null, 2));

// Expected values based on live_data.json
const expectedMetrics = {
  bounces_last_12_months: 0,
  bounces_last_3_months: 0,
  bounces_last_6_months: 0,
  cibil_score: 753,
  credit_accounts_count: 2,
  high_credit_all_loans: 148990, // 105892 + 43098
  inquiries_count: 9,
  inquiries_last_1_month: 2, // 2025-11-13, 2025-10-20
  inquiries_last_3_months: 5, // All within 90 days from 2025-11-13
  inquiries_last_6_months: 9, // All within 180 days from 2025-11-13
  maximum_delay_emi_payment: 0,
  npa_tagging: 'NO',
  population_rank: 21,
  score_model: 'CIBILTUSC3',
  sma_tagging: 'NO',
  timely_emi_payment_percentage: 100.0,
  total_liabilities: 109230, // 66132 + 43098
  total_secured_loans: 0, // No secured loans in live_data
  total_unsecured_loans: 109230, // 66132 (credit card 10) + 43098 (personal loan 05)
  write_off_tagging_last_12_months: 'NO',
};

console.log('\n' + '='.repeat(80));
console.log('VALIDATION RESULTS');
console.log('='.repeat(80));

let passedTests = 0;
let failedTests = 0;

for (const [key, expectedValue] of Object.entries(expectedMetrics)) {
  const actualValue = metrics[key];
  const passed = actualValue === expectedValue;

  if (passed) {
    console.log(`✅ ${key}: ${actualValue}`);
    passedTests++;
  } else {
    console.log(`❌ ${key}:`);
    console.log(`   Expected: ${expectedValue}`);
    console.log(`   Actual: ${actualValue}`);
    failedTests++;
  }
}

console.log('\n' + '='.repeat(80));
console.log(
  `SUMMARY: ${passedTests} passed, ${failedTests} failed out of ${Object.keys(expectedMetrics).length} tests`,
);
console.log('='.repeat(80));

if (failedTests === 0) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log(`⚠️  ${failedTests} test(s) failed`);
  process.exit(1);
}
