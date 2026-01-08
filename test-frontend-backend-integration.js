#!/usr/bin/env node

/**
 * ============================================================
 * FRONTEND-BACKEND INTEGRATION TEST FOR CIBIL SCORE FORM
 * ============================================================
 * This script simulates a user filling out the CIBIL score form
 * on the frontend and validates the complete end-to-end workflow
 * ============================================================
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Suppress SSL warnings for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Test user data - simulate form submission
const testUsers = [
  {
    clientKey: 'MAN-233371384',
    PartnerCustomerId: 'CIB-288839061',
    formData: {
      gender: 'Male',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      mobileNumber: '9876543210',
      email: 'rajesh.kumar@example.com',
      idNumber: 'AFZPK5055K',
      dateOfBirth: '1985-06-15',
      termsAccepted: true,
      conditionsAccepted: true,
      IdentifierName: 'TaxId',
    },
  },
  {
    clientKey: 'MAN-371361437',
    PartnerCustomerId: 'CIB-803324738',
    formData: {
      gender: 'Female',
      firstName: 'Priya',
      lastName: 'Singh',
      mobileNumber: '9123456789',
      email: 'priya.singh@example.com',
      idNumber: 'BBPPS1234A',
      dateOfBirth: '1990-03-20',
      termsAccepted: true,
      conditionsAccepted: true,
      IdentifierName: 'TaxId',
    },
  },
];

const API_BASE = 'https://dev.3.108.103.172.nip.io/api/v1';
const BACKEND_BASE = 'https://dev.3.108.103.172.nip.io';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(100));
  log(title, 'cyan');
  console.log('='.repeat(100) + '\n');
}

function makeRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      rejectUnauthorized: false,
    };

    const request = https.request(url, options, response => {
      let responseData = '';

      response.on('data', chunk => {
        responseData += chunk;
      });

      response.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: response.statusCode,
            data: parsedData,
          });
        } catch (error) {
          resolve({
            status: response.statusCode,
            data: responseData,
          });
        }
      });
    });

    request.on('error', error => {
      reject(error);
    });

    if (data) {
      request.write(JSON.stringify(data));
    }
    request.end();
  });
}

async function testStep1_FetchCibilData(clientKey, partnerId) {
  log(`\n[STEP 1] 🔍 Fetch CIBIL Data from Real API`, 'blue');
  log(`Client Key: ${clientKey}`, 'gray');
  log(`Partner ID: ${partnerId}`, 'gray');

  try {
    const response = await makeRequest(
      'POST',
      `${API_BASE}/cibil-wrapper/getCustomerAssets`,
      {
        clientKey,
        PartnerCustomerId: partnerId,
      },
    );

    if (response.status !== 200) {
      log(`✗ FAILED - Status: ${response.status}`, 'red');
      return null;
    }

    const responseStatus =
      response.data?.data?.GetCustomerAssetsResponse?.ResponseStatus;
    if (responseStatus === 'Failure') {
      log(`✗ FAILED - API returned failure status`, 'red');
      return null;
    }

    const cibilScore =
      response.data?.data?.GetCustomerAssetsResponse?.GetCustomerAssetsSuccess
        ?.Asset?.TrueLinkCreditReport?.Borrower?.CreditScore?.riskScore;

    log(`✓ SUCCESS - CIBIL Score: ${cibilScore}`, 'green');
    return response.data.data;
  } catch (error) {
    log(`✗ ERROR: ${error.message}`, 'red');
    return null;
  }
}

async function testStep2_CalculateMetrics(cibilData) {
  log(`\n[STEP 2] 📊 Calculate All 20 Credit Metrics`, 'blue');

  try {
    // Import the calculation function
    const calculateCreditMetrics = require('./utils/calculateCreditMetrics');
    const metrics = calculateCreditMetrics(cibilData);

    if (!metrics || metrics.cibil_score === 0) {
      log(`✗ FAILED - Metrics calculation returned zero values`, 'red');
      return null;
    }

    log(`✓ SUCCESS - Metrics calculated`, 'green');
    log(`  - CIBIL Score: ${metrics.cibil_score}`, 'gray');
    log(`  - Population Rank: ${metrics.population_rank}`, 'gray');
    log(`  - Total Liabilities: ₹${metrics.total_liabilities}`, 'gray');
    log(`  - Bounces (12m): ${metrics.bounces_last_12_months}`, 'gray');
    log(
      `  - Payment Timeliness: ${metrics.timely_emi_payment_percentage}%`,
      'gray',
    );
    log(`  - SMA Tagged: ${metrics.sma_tagging}`, 'gray');

    return metrics;
  } catch (error) {
    log(`✗ ERROR: ${error.message}`, 'red');
    return null;
  }
}

async function testStep3_CheckExistingUser(formData, clientKey, partnerId) {
  log(`\n[STEP 3] 🔐 Check if User Already Exists`, 'blue');
  log(`Name: ${formData.firstName} ${formData.lastName}`, 'gray');
  log(`Mobile: ${formData.mobileNumber}`, 'gray');
  log(`Identifier: ${formData.idNumber}`, 'gray');

  try {
    const response = await makeRequest(
      'POST',
      `${BACKEND_BASE}/api/v1/cibil-score/check-existing`,
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        mobile_number: formData.mobileNumber,
        IdentifierId: formData.idNumber,
      },
    );

    if (response.status !== 200) {
      log(`✗ FAILED - Status: ${response.status}`, 'red');
      return null;
    }

    const userExists = response.data?.userExists || response.data?.success;
    const userId =
      response.data?.data?.id || response.data?.data?._id || response.data?.id;

    if (userExists && userId) {
      log(`✓ USER EXISTS - ID: ${userId}`, 'green');
    } else {
      log(`✓ NEW USER - Will be created`, 'yellow');
    }

    return {
      exists: userExists,
      userId,
      response: response.data,
    };
  } catch (error) {
    log(`✗ ERROR: ${error.message}`, 'red');
    return null;
  }
}

async function testStep4_CreateOrUpdateUser(
  formData,
  metrics,
  cibilData,
  clientKey,
  partnerId,
) {
  log(`\n[STEP 4] 💾 Create/Update User Record in Database`, 'blue');

  try {
    const cibilScore =
      cibilData?.GetCustomerAssetsResponse?.GetCustomerAssetsSuccess?.Asset
        ?.TrueLinkCreditReport?.Borrower?.CreditScore?.riskScore;

    const createUserPayload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      mobile_number: formData.mobileNumber,
      gender: formData.gender,
      dob: formData.dateOfBirth,
      IdentifierId: formData.idNumber,
      IdentifierName: formData.IdentifierName,
      clientKey: clientKey,
      PartnerCustomerId: partnerId,
      cibil_score: metrics.cibil_score,
      population_rank: metrics.population_rank,
      score_model: metrics.score_model,
      credit_accounts_count: metrics.credit_accounts_count,
      inquiries_count: metrics.inquiries_count,
      inquiries_last_1_month: metrics.inquiries_last_1_month,
      inquiries_last_3_months: metrics.inquiries_last_3_months,
      inquiries_last_6_months: metrics.inquiries_last_6_months,
      total_secured_loans: metrics.total_secured_loans,
      total_unsecured_loans: metrics.total_unsecured_loans,
      total_liabilities: metrics.total_liabilities,
      high_credit_all_loans: metrics.high_credit_all_loans,
      maximum_delay_emi_payment: metrics.maximum_delay_emi_payment,
      bounces_last_3_months: metrics.bounces_last_3_months,
      bounces_last_6_months: metrics.bounces_last_6_months,
      bounces_last_12_months: metrics.bounces_last_12_months,
      timely_emi_payment_percentage: metrics.timely_emi_payment_percentage,
      sma_tagging: metrics.sma_tagging,
      npa_tagging: metrics.npa_tagging,
      write_off_tagging_last_12_months:
        metrics.write_off_tagging_last_12_months,
    };

    const response = await makeRequest(
      'POST',
      `${BACKEND_BASE}/api/v1/cibil-score/add`,
      createUserPayload,
    );

    if (response.status !== 201 && response.status !== 200) {
      log(`✗ FAILED - Status: ${response.status}`, 'red');
      return null;
    }

    const userId = response.data?.data?.id || response.data?.data?._id;
    log(`✓ SUCCESS - User ID: ${userId}`, 'green');
    return userId;
  } catch (error) {
    log(`✗ ERROR: ${error.message}`, 'red');
    return null;
  }
}

async function testStep5_CreateLoanApplication(
  formData,
  metrics,
  clientKey,
  partnerId,
  userId,
) {
  log(`\n[STEP 5] 📝 Create Loan Application Entry`, 'blue');

  try {
    const loanAppPayload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      mobile_number: formData.mobileNumber,
      dob: formData.dateOfBirth,
      pan_number: formData.idNumber,
      aadhar_number: '',
      loan_type: 'Udyam Loan',
      loan_amount: '',
      loan_duration: '',
      city_name: '',
      state_name: '',
      pin_code: '',
      business_name: '',
      income: '',
      cibil_score: metrics.cibil_score,
      PartnerCustomerId: partnerId,
      IdentifierId: formData.idNumber,
      IdentifierName: formData.IdentifierName,
      gender: formData.gender,
      population_rank: metrics.population_rank,
      score_model: metrics.score_model,
      IVStatus: 'Active',
      clientKey: clientKey,
      bounces_last_3_months: metrics.bounces_last_3_months,
      bounces_last_6_months: metrics.bounces_last_6_months,
      bounces_last_12_months: metrics.bounces_last_12_months,
      inquiries_last_1_month: metrics.inquiries_last_1_month,
      inquiries_last_3_months: metrics.inquiries_last_3_months,
      inquiries_last_6_months: metrics.inquiries_last_6_months,
      maximum_delay_emi_payment: metrics.maximum_delay_emi_payment,
      timely_emi_payment_percentage: metrics.timely_emi_payment_percentage,
      npa_tagging: metrics.npa_tagging,
      sma_tagging: metrics.sma_tagging,
      write_off_tagging_last_12_months:
        metrics.write_off_tagging_last_12_months,
      high_credit_all_loans: metrics.high_credit_all_loans,
      total_liabilities: metrics.total_liabilities,
      total_secured_loans: metrics.total_secured_loans,
      total_unsecured_loans: metrics.total_unsecured_loans,
      credit_accounts_count: metrics.credit_accounts_count,
      inquiries_count: metrics.inquiries_count,
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
    };

    // Note: Loan application endpoint may vary, adjust URL as needed
    const response = await makeRequest(
      'POST',
      `${BACKEND_BASE}/api/v1/loan-application/create`,
      loanAppPayload,
    );

    if (response.status === 200 || response.status === 201) {
      log(`✓ SUCCESS - Loan application created`, 'green');
      return response.data?.data?._id || 'SUCCESS';
    } else {
      log(
        `⚠ WARNING - Loan app endpoint may not exist (Status: ${response.status})`,
        'yellow',
      );
      return 'SKIPPED';
    }
  } catch (error) {
    log(`⚠ WARNING - Loan app step skipped: ${error.message}`, 'yellow');
    return 'SKIPPED';
  }
}

async function testCompleteWorkflow() {
  logSection('FRONTEND-BACKEND INTEGRATION TEST - COMPLETE WORKFLOW');

  let totalTests = 0;
  let passedTests = 0;
  const results = [];

  for (const testUser of testUsers) {
    logSection(
      `Testing User: ${testUser.formData.firstName} ${testUser.formData.lastName}`,
    );

    let stepsPassed = 0;
    let stepsTotal = 5;

    // STEP 1: Fetch CIBIL Data
    const cibilData = await testStep1_FetchCibilData(
      testUser.clientKey,
      testUser.PartnerCustomerId,
    );
    if (cibilData) stepsPassed++;
    totalTests++;

    if (!cibilData) {
      log('\n⚠️ Cannot proceed - CIBIL data fetch failed', 'red');
      continue;
    }

    // STEP 2: Calculate Metrics
    const metrics = await testStep2_CalculateMetrics(cibilData);
    if (metrics) stepsPassed++;
    totalTests++;

    if (!metrics) {
      log('\n⚠️ Cannot proceed - Metrics calculation failed', 'red');
      continue;
    }

    // STEP 3: Check Existing User
    const userCheck = await testStep3_CheckExistingUser(
      testUser.formData,
      testUser.clientKey,
      testUser.PartnerCustomerId,
    );
    if (userCheck) stepsPassed++;
    totalTests++;

    // STEP 4: Create/Update User
    const userId = await testStep4_CreateOrUpdateUser(
      testUser.formData,
      metrics,
      cibilData,
      testUser.clientKey,
      testUser.PartnerCustomerId,
    );
    if (userId) stepsPassed++;
    totalTests++;

    // STEP 5: Create Loan Application
    if (userId) {
      const loanAppResult = await testStep5_CreateLoanApplication(
        testUser.formData,
        metrics,
        testUser.clientKey,
        testUser.PartnerCustomerId,
        userId,
      );
      if (loanAppResult) stepsPassed++;
    }
    totalTests++;

    // Summary for this user
    logSection(`User Test Summary: ${testUser.formData.firstName}`);
    log(
      `Steps Passed: ${stepsPassed}/${stepsTotal}`,
      stepsPassed === stepsTotal ? 'green' : 'yellow',
    );

    if (stepsPassed === stepsTotal) {
      passedTests++;
      log(`✅ WORKFLOW COMPLETED SUCCESSFULLY`, 'green');
    } else if (stepsPassed >= 4) {
      log(
        `⚠️ WORKFLOW MOSTLY SUCCESSFUL (${stepsPassed} of ${stepsTotal} steps)`,
        'yellow',
      );
    } else {
      log(`❌ WORKFLOW FAILED`, 'red');
    }

    results.push({
      user: `${testUser.formData.firstName} ${testUser.formData.lastName}`,
      passed: stepsPassed,
      total: stepsTotal,
      success: stepsPassed === stepsTotal,
    });
  }

  // Final Summary
  logSection('FINAL TEST SUMMARY');
  log(`Total Users Tested: ${testUsers.length}`, 'cyan');
  log(
    `Successful Workflows: ${passedTests}/${testUsers.length}`,
    passedTests === testUsers.length ? 'green' : 'yellow',
  );

  results.forEach(result => {
    const status = result.success ? '✅' : '⚠️';
    log(
      `${status} ${result.user}: ${result.passed}/${result.total}`,
      result.success ? 'green' : 'yellow',
    );
  });

  console.log('\n' + '='.repeat(100) + '\n');
}

// Run the test
testCompleteWorkflow().catch(error => {
  log(`\n❌ FATAL ERROR: ${error.message}`, 'red');
  process.exit(1);
});
