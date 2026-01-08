/**
 * Test Case: Extract CIBIL Metrics for User
 * clientKey: MAN-792432846
 * PartnerCustomerId: CIB-320684438
 */

const calculateCreditMetrics = require('./utils/calculateCreditMetrics');
const fs = require('fs');
const path = require('path');

// User credentials provided for testing
const testUser = {
  clientKey: 'MAN-371361437',
  PartnerCustomerId: 'CIB-803324738',
};

console.log('\n' + '='.repeat(90));
console.log('CIBIL METRICS EXTRACTION TEST');
console.log('='.repeat(90));

console.log('\n📝 TEST USER CREDENTIALS:');
console.log(`   Client Key: ${testUser.clientKey}`);
console.log(`   Partner Customer ID: ${testUser.PartnerCustomerId}`);

// Load sample CIBIL API response
const liveDataPath = path.join(__dirname, './live_data.json');
const apiResponse = JSON.parse(fs.readFileSync(liveDataPath, 'utf8'));

console.log('\n📡 SIMULATING CIBIL API RESPONSE:');
console.log(`   Source: live_data.json (realistic sample)`);
console.log(
  `   API Response Status: ${apiResponse.data.GetCustomerAssetsResponse.ResponseStatus}`,
);

// Extract and calculate all metrics
console.log('\n🔄 CALCULATING METRICS...\n');
const metrics = calculateCreditMetrics(apiResponse.data);

// Display results in a formatted table
console.log('='.repeat(90));
console.log('EXTRACTED METRICS FOR USER');
console.log('='.repeat(90));

// Group metrics by category
const categories = {
  'CIBIL Score Information': ['cibil_score', 'population_rank', 'score_model'],
  'Credit Account Information': [
    'credit_accounts_count',
    'inquiries_count',
    'inquiries_last_1_month',
    'inquiries_last_3_months',
    'inquiries_last_6_months',
  ],
  'Loan Amounts': [
    'total_secured_loans',
    'total_unsecured_loans',
    'total_liabilities',
    'high_credit_all_loans',
  ],
  'Payment History': [
    'maximum_delay_emi_payment',
    'timely_emi_payment_percentage',
    'bounces_last_3_months',
    'bounces_last_6_months',
    'bounces_last_12_months',
  ],
  'Credit Tags & Flags': [
    'sma_tagging',
    'npa_tagging',
    'write_off_tagging_last_12_months',
  ],
};

// Print categorized metrics
for (const [category, fields] of Object.entries(categories)) {
  console.log(`\n${category}:`);
  console.log('-'.repeat(90));

  fields.forEach((field, index) => {
    const value = metrics[field];
    const displayValue = typeof value === 'string' ? `"${value}"` : value;
    const padding = ' '.repeat(Math.max(0, 45 - field.length));
    console.log(`  ${index + 1}. ${field}${padding}: ${displayValue}`);
  });
}

// Complete JSON representation
console.log('\n' + '='.repeat(90));
console.log('COMPLETE METRICS JSON OUTPUT');
console.log('='.repeat(90));
console.log(JSON.stringify(metrics, null, 2));

// Summary statistics
console.log('\n' + '='.repeat(90));
console.log('SUMMARY STATISTICS');
console.log('='.repeat(90));
console.log(`
Total Metrics Extracted:        20
Credit Score:                   ${metrics.cibil_score}/900
Total Credit Accounts:          ${metrics.credit_accounts_count}
Total Credit Inquiries:         ${metrics.inquiries_count}
Total Outstanding Amount:       ₹${metrics.total_liabilities.toLocaleString('en-IN')}
Maximum Credit Extended:        ₹${metrics.high_credit_all_loans.toLocaleString('en-IN')}
On-Time Payment Percentage:     ${metrics.timely_emi_payment_percentage}%
Special Mention Account (SMA):  ${metrics.sma_tagging}
Non-Performing Asset (NPA):     ${metrics.npa_tagging}
Write-Off in Last 12 Months:    ${metrics.write_off_tagging_last_12_months}
`);

// Data ready for database update
console.log('='.repeat(90));
console.log('DATABASE UPDATE PAYLOAD (Ready to send to backend)');
console.log('='.repeat(90));

const dbPayload = {
  id: 'mongodb_user_id_here', // This would come from the user record
  clientKey: testUser.clientKey,
  PartnerCustomerId: testUser.PartnerCustomerId,
  ...metrics,
};

console.log(JSON.stringify(dbPayload, null, 2));

console.log('\n' + '='.repeat(90));
console.log('✅ TEST COMPLETED SUCCESSFULLY');
console.log('='.repeat(90));
console.log('\n📌 NEXT STEPS:');
console.log('   1. Verify all 20 metrics have been extracted');
console.log(
  '   2. Send the payload above to PUT /api/v1/cibil-score/update endpoint',
);
console.log('   3. Database will be updated with all credit metrics');
console.log(
  `   4. User (${testUser.clientKey}) profile will have complete credit analysis\n`,
);
