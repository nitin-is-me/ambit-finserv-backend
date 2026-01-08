const https = require('https');
const fs = require('fs');
const path = require('path');

// API endpoint and credentials
const apiUrl =
  'https://dev.3.108.103.172.nip.io/api/v1/cibil-wrapper/getCustomerAssets';
const payload = {
  clientKey: 'MAN-371361437',
  PartnerCustomerId: 'CIB-803324738',
};

console.log('\n' + '='.repeat(100));
console.log('FETCHING ACTUAL CIBIL DATA FROM API');
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
  rejectUnauthorized: false, // For dev/self-signed certificates
};

const req = https.request(apiUrl, options, res => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      console.log(`\n✅ API Response Status: ${res.statusCode}`);

      // Parse response
      const response = JSON.parse(data);

      // Check if response is successful
      if (res.statusCode === 200 && response.data) {
        console.log(`✅ Successfully received CIBIL data`);

        // Get data portion
        const cibilData = {
          data: response.data,
        };

        // Save to live_data.json
        const outputPath = path.join(__dirname, 'live_data.json');
        fs.writeFileSync(outputPath, JSON.stringify(cibilData, null, 2));
        console.log(`\n✅ Real CIBIL data saved to: ${outputPath}`);

        // Display summary
        const borrower = response.data?.TrueLinkCreditReport?.Borrower || {};
        console.log('\n📊 DATA SUMMARY:');
        console.log(
          `   - CIBIL Score: ${borrower.CreditScore?.riskScore || 'N/A'}`,
        );
        console.log(
          `   - Population Rank: ${borrower.CreditScore?.populationRank || 'N/A'}`,
        );
        console.log(
          `   - Trade Lines: ${(borrower.TradeLinePartition || []).length}`,
        );
        console.log(
          `   - Inquiries: ${(borrower.InquiryPartition || []).length}`,
        );

        console.log('\n' + '='.repeat(100));
        console.log('✅ DATA FETCH COMPLETE - Ready for metric extraction');
        console.log('='.repeat(100) + '\n');
      } else {
        console.error(`❌ Error: Status ${res.statusCode}`);
        console.error('Response:', data);
        process.exit(1);
      }
    } catch (err) {
      console.error('❌ Error parsing response:', err.message);
      console.error('Response data:', data);
      process.exit(1);
    }
  });
});

req.on('error', err => {
  console.error('❌ API Request Error:', err.message);
  process.exit(1);
});

// Send request
req.write(JSON.stringify(payload));
req.end();
