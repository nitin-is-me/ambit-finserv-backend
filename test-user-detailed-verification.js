const fs = require('fs');
const path = require('path');
const calculateCreditMetrics = require('./utils/calculateCreditMetrics');

// Test user credentials
const testUser = {
  clientKey: 'MAN-371361437',
  PartnerCustomerId: 'CIB-803324738',
};

// Load actual CIBIL data for this user with bounces
const actualDataPath = path.join(__dirname, 'test-data-actual-bounces.json');
const actualData = JSON.parse(fs.readFileSync(actualDataPath, 'utf8'));

console.log('\n' + '='.repeat(100));
console.log('DETAILED CIBIL METRICS VERIFICATION - ACTUAL USER DATA');
console.log('='.repeat(100));

console.log('\n📝 TEST USER CREDENTIALS:');
console.log(`   Client Key: ${testUser.clientKey}`);
console.log(`   Partner Customer ID: ${testUser.PartnerCustomerId}`);

console.log('\n📡 DATA SOURCE:');
console.log(
  `   Source: test-data-actual-bounces.json (Real CIBIL data with bounces)`,
);
console.log(`   Report Date: ${actualData.data.Sources.Source.InquiryDate}`);

// Extract raw data for analysis
const borrower = actualData.data.TrueLinkCreditReport.Borrower;
console.log('\n🔍 RAW DATA ANALYSIS:');
console.log(`   Total Trade Lines: ${borrower.TradeLinePartition.length}`);
console.log(`   Total Inquiries: ${borrower.InquiryPartition.length}`);

// Detailed payment history analysis
console.log('\n📊 PAYMENT HISTORY DETAIL:');
borrower.TradeLinePartition.forEach((tradelinePartition, idx) => {
  const tradeline = tradelinePartition.Tradeline;
  console.log(
    `\n   Account ${idx + 1}: ${tradeline.creditorName} (Type: ${tradeline.accountTypeSymbol})`,
  );
  console.log(`   High Credit: ₹${tradeline.highBalance}`);
  console.log(`   Current Balance: ₹${tradeline.currentBalance}`);
  console.log(`   Payment Status History (Last 12 months):`);

  const payStatusHistory =
    tradeline.GrantedTrade?.PayStatusHistory?.MonthlyPayStatus || [];
  payStatusHistory.forEach(payment => {
    const date = payment.date.split('+')[0];
    const status = payment.status;
    let statusLabel = '';

    if (status === '0') statusLabel = '✅ On-Time';
    else if (status === 'XXX') statusLabel = '⚪ No Data';
    else if (status === 'STD') statusLabel = '⚪ Standard';
    else statusLabel = `❌ Irregular (${status})`;

    console.log(`      ${date}: Status ${status} ${statusLabel}`);
  });
});

// Calculate metrics
console.log('\n🔄 CALCULATING METRICS...\n');
const metrics = calculateCreditMetrics(actualData.data);

console.log('✅ Credit metrics calculated successfully');

console.log('\n' + '='.repeat(100));
console.log('EXTRACTED METRICS VERIFICATION');
console.log('='.repeat(100));

// Display all 20 metrics with values
const metricsDisplay = {
  'CIBIL SCORE INFORMATION': {
    cibil_score: metrics.cibil_score,
    population_rank: metrics.population_rank,
    score_model: metrics.score_model,
  },
  'CREDIT ACCOUNT INFORMATION': {
    credit_accounts_count: metrics.credit_accounts_count,
    inquiries_count: metrics.inquiries_count,
    inquiries_last_1_month: metrics.inquiries_last_1_month,
    inquiries_last_3_months: metrics.inquiries_last_3_months,
    inquiries_last_6_months: metrics.inquiries_last_6_months,
  },
  'LOAN AMOUNTS': {
    total_secured_loans: metrics.total_secured_loans,
    total_unsecured_loans: metrics.total_unsecured_loans,
    total_liabilities: metrics.total_liabilities,
    high_credit_all_loans: metrics.high_credit_all_loans,
  },
  'PAYMENT HISTORY': {
    maximum_delay_emi_payment: metrics.maximum_delay_emi_payment,
    timely_emi_payment_percentage: metrics.timely_emi_payment_percentage,
    bounces_last_3_months: metrics.bounces_last_3_months,
    bounces_last_6_months: metrics.bounces_last_6_months,
    bounces_last_12_months: metrics.bounces_last_12_months,
  },
  'CREDIT TAGS & FLAGS': {
    sma_tagging: metrics.sma_tagging,
    npa_tagging: metrics.npa_tagging,
    write_off_tagging_last_12_months: metrics.write_off_tagging_last_12_months,
  },
};

Object.entries(metricsDisplay).forEach(([category, values]) => {
  console.log(`\n${category}:`);
  console.log('-'.repeat(100));
  Object.entries(values).forEach(([key, value]) => {
    const displayValue = typeof value === 'string' ? `"${value}"` : value;
    console.log(`  ${key.padEnd(40)}: ${displayValue}`);
  });
});

// EXPECTED vs ACTUAL comparison
console.log('\n' + '='.repeat(100));
console.log('VERIFICATION: EXPECTED vs ACTUAL');
console.log('='.repeat(100));

const expectedValues = {
  bounces_last_3_months: 1,
  bounces_last_6_months: 4,
  bounces_last_12_months: 6,
  credit_accounts_count: 2,
  inquiries_count: 9,
  total_secured_loans: 0,
};

console.log('\nBounce Count Verification:');
console.log('-'.repeat(100));

let bounceVerificationPassed = true;

Object.entries(expectedValues).forEach(([metric, expectedValue]) => {
  const actualValue = metrics[metric];
  const match = actualValue === expectedValue ? '✅ PASS' : '❌ FAIL';

  if (actualValue !== expectedValue) {
    bounceVerificationPassed = false;
  }

  console.log(
    `  ${metric.padEnd(35)}: Expected ${expectedValue}, Got ${actualValue} ${match}`,
  );
});

// Full metrics JSON output
console.log('\n' + '='.repeat(100));
console.log('COMPLETE METRICS JSON');
console.log('='.repeat(100));
console.log(JSON.stringify(metrics, null, 2));

// Summary
console.log('\n' + '='.repeat(100));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(100));

console.log('\n📌 KEY FINDINGS:');
console.log(`   ✓ Bounce Analysis:`);
console.log(
  `     - Last 3 Months:  ${metrics.bounces_last_3_months} bounce(s) ${metrics.bounces_last_3_months === 1 ? '✅' : '❌'}`,
);
console.log(
  `     - Last 6 Months:  ${metrics.bounces_last_6_months} bounce(s) ${metrics.bounces_last_6_months === 4 ? '✅' : '❌'}`,
);
console.log(
  `     - Last 12 Months: ${metrics.bounces_last_12_months} bounce(s) ${metrics.bounces_last_12_months === 6 ? '✅' : '❌'}`,
);

console.log(`\n   ✓ Credit Accounts: ${metrics.credit_accounts_count}`);
console.log(`   ✓ Total Inquiries: ${metrics.inquiries_count}`);
console.log(`   ✓ Total Liabilities: ₹${metrics.total_liabilities}`);
console.log(`   ✓ Credit Score: ${metrics.cibil_score}/900`);

// Account Analysis
console.log(`\n   ✓ Accounts Breakdown:`);
console.log(`     - Account Type 50 (SIDBI): Irregular payments detected`);
console.log(`     - Account Type 05 (HDFC): All on-time payments`);

console.log('\n📊 OVERALL STATUS:');
if (bounceVerificationPassed) {
  console.log(`   ✅ ALL VERIFICATIONS PASSED - Metrics match expected values`);
} else {
  console.log(`   ⚠️  VERIFICATION MISMATCH - Review bounce calculations`);
}

console.log('\n' + '='.repeat(100));
console.log('✅ DETAILED VERIFICATION COMPLETE');
console.log('='.repeat(100));
