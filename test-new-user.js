const https = require('https');
const fs = require('fs');
const path = require('path');
const calculateCreditMetrics = require('./utils/calculateCreditMetrics');

// API endpoint and credentials
const apiUrl =
  'https://dev.3.108.103.172.nip.io/api/v1/cibil-wrapper/getCustomerAssets';
const payload = {
  clientKey: 'MAN-233371384',
  PartnerCustomerId: 'CIB-288839061',
};

console.log('\n' + '='.repeat(100));
console.log('FETCHING REAL CIBIL DATA FOR NEW USER');
console.log('='.repeat(100));
console.log(`\nAPI Endpoint: ${apiUrl}`);
console.log(`Client Key: ${payload.clientKey}`);
console.log(`Partner Customer ID: ${payload.PartnerCustomerId}`);

// Make HTTPS request (ignoring SSL certificate for dev environment)
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
  },
  rejectUnauthorized: false,
};

const req = https.request(apiUrl, options, res => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      console.log(`\n✅ API Response Status: ${res.statusCode}`);

      const response = JSON.parse(data);

      if (res.statusCode === 200 && response.data) {
        console.log(`✅ Successfully received CIBIL data`);

        // Calculate metrics
        console.log(`\n🔄 CALCULATING ALL 20 METRICS...\n`);
        const metrics = calculateCreditMetrics(response.data);

        // Display summary
        const borrower = response.data?.TrueLinkCreditReport?.Borrower || {};
        console.log('='.repeat(100));
        console.log('EXTRACTED METRICS FOR NEW USER');
        console.log('='.repeat(100));

        console.log('\n📊 ALL 20 CREDIT METRICS:');
        console.log('-'.repeat(100));

        const metricsArray = [
          ['1. cibil_score', metrics.cibil_score],
          ['2. population_rank', metrics.population_rank],
          ['3. score_model', metrics.score_model],
          ['4. credit_accounts_count', metrics.credit_accounts_count],
          ['5. inquiries_count', metrics.inquiries_count],
          ['6. inquiries_last_1_month', metrics.inquiries_last_1_month],
          ['7. inquiries_last_3_months', metrics.inquiries_last_3_months],
          ['8. inquiries_last_6_months', metrics.inquiries_last_6_months],
          ['9. total_secured_loans', metrics.total_secured_loans],
          ['10. total_unsecured_loans', metrics.total_unsecured_loans],
          ['11. total_liabilities', metrics.total_liabilities],
          ['12. high_credit_all_loans', metrics.high_credit_all_loans],
          ['13. maximum_delay_emi_payment', metrics.maximum_delay_emi_payment],
          ['14. bounces_last_3_months', metrics.bounces_last_3_months],
          ['15. bounces_last_6_months', metrics.bounces_last_6_months],
          ['16. bounces_last_12_months', metrics.bounces_last_12_months],
          [
            '17. timely_emi_payment_percentage',
            metrics.timely_emi_payment_percentage,
          ],
          ['18. sma_tagging', metrics.sma_tagging],
          ['19. npa_tagging', metrics.npa_tagging],
          [
            '20. write_off_tagging_last_12_months',
            metrics.write_off_tagging_last_12_months,
          ],
        ];

        metricsArray.forEach(([label, value]) => {
          const displayValue =
            typeof value === 'number'
              ? Number.isInteger(value)
                ? value.toLocaleString()
                : value.toFixed(2)
              : value;
          console.log(`${label.padEnd(50)} : ${displayValue}`);
        });

        console.log('\n' + '='.repeat(100));
        console.log('COMPLETE JSON PAYLOAD (READY FOR DATABASE)');
        console.log('='.repeat(100));
        console.log(
          JSON.stringify(
            {
              clientKey: payload.clientKey,
              PartnerCustomerId: payload.PartnerCustomerId,
              ...metrics,
            },
            null,
            2,
          ),
        );

        console.log('\n' + '='.repeat(100));
        console.log('✅ EXTRACTION COMPLETE - ALL 20 METRICS EXTRACTED');
        console.log('='.repeat(100) + '\n');
      } else {
        console.error(`❌ Error: Status ${res.statusCode}`);
        console.error('Response:', data);
        process.exit(1);
      }
    } catch (err) {
      console.error('❌ Error parsing response:', err.message);
      console.error('Response data:', data.substring(0, 500));
      process.exit(1);
    }
  });
});

req.on('error', err => {
  console.error('❌ API Request Error:', err.message);
  process.exit(1);
});

req.write(JSON.stringify(payload));
req.end();
