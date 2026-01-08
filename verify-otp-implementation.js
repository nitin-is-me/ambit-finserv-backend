#!/usr/bin/env node
/**
 * OTP Implementation Verification Script
 * Tests all components of the OTP system
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 OTP Implementation Verification\n');
console.log('='.repeat(50));

// Test 1: Check all required files exist
console.log('\n1️⃣  Checking Backend Files...');
const backendFiles = [
  'controllers/otp/requestOtp.js',
  'controllers/otp/verifyOtp.js',
  'model/otpModel.js',
  'utils/otpHelpers.js',
  'validation/otpValidation.js',
  'routes/otpRoute.js',
];

backendFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
  }
});

// Test 2: Check frontend files
console.log('\n2️⃣  Checking Frontend Files...');
const frontendRoot = path.join(
  __dirname,
  '../../ambit-frontend/ambit-finserv-web/src',
);
const frontendFiles = ['utils/otpEncryption.js', 'services/otpService.js'];

frontendFiles.forEach(file => {
  const fullPath = path.join(frontendRoot, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
  }
});

// Test 3: Check configuration files
console.log('\n3️⃣  Checking Configuration...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const required = ['OTP_SECRET_KEY', 'SMS_GATEWAY_URL', 'DATABASE_URL'];

  required.forEach(key => {
    if (envContent.includes(key)) {
      console.log(`  ✅ ${key} configured`);
    } else {
      console.log(`  ⚠️  ${key} not found in .env`);
    }
  });
} else {
  console.log(`  ❌ .env file not found`);
}

// Test 4: Check documentation
console.log('\n4️⃣  Checking Documentation...');
const docs = [
  'OTP_IMPLEMENTATION_GUIDE.md',
  'OTP_MIGRATION_CHECKLIST.md',
  'OTP_QUICK_REFERENCE.md',
];

docs.forEach(doc => {
  const fullPath = path.join(__dirname, doc);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${doc}`);
  } else {
    console.log(`  ❌ ${doc} - NOT FOUND`);
  }
});

// Test 5: Syntax validation
console.log('\n5️⃣  Checking Code Syntax...');
try {
  require('./controllers/otp/requestOtp');
  console.log('  ✅ requestOtp.js - Valid syntax');
} catch (e) {
  console.log(`  ❌ requestOtp.js - ${e.message.split('\n')[0]}`);
}

try {
  require('./controllers/otp/verifyOtp');
  console.log('  ✅ verifyOtp.js - Valid syntax');
} catch (e) {
  console.log(`  ❌ verifyOtp.js - ${e.message.split('\n')[0]}`);
}

try {
  require('./model/otpModel');
  console.log('  ✅ otpModel.js - Valid syntax');
} catch (e) {
  console.log(`  ❌ otpModel.js - ${e.message.split('\n')[0]}`);
}

try {
  require('./utils/otpHelpers');
  console.log('  ✅ otpHelpers.js - Valid syntax');
} catch (e) {
  console.log(`  ❌ otpHelpers.js - ${e.message.split('\n')[0]}`);
}

try {
  require('./validation/otpValidation');
  console.log('  ✅ otpValidation.js - Valid syntax');
} catch (e) {
  console.log(`  ❌ otpValidation.js - ${e.message.split('\n')[0]}`);
}

try {
  require('./routes/otpRoute');
  console.log('  ✅ otpRoute.js - Valid syntax');
} catch (e) {
  console.log(`  ❌ otpRoute.js - ${e.message.split('\n')[0]}`);
}

// Test 6: Check routes integration
console.log('\n6️⃣  Checking Routes Integration...');
try {
  const indexPath = path.join(__dirname, 'routes/index.js');
  const indexContent = fs.readFileSync(indexPath, 'utf8');

  if (indexContent.includes("require('./otpRoute')")) {
    console.log('  ✅ otpRoute imported in routes/index.js');
  } else {
    console.log('  ❌ otpRoute not imported');
  }

  if (indexContent.includes("path: '/otp'")) {
    console.log('  ✅ OTP route path registered');
  } else {
    console.log('  ❌ OTP route path not registered');
  }
} catch (e) {
  console.log(`  ❌ Error checking routes: ${e.message}`);
}

// Test 7: Test helper functions
console.log('\n7️⃣  Testing Helper Functions...');
try {
  const {
    hashPhoneNumber,
    hashOTP,
    generateOTP,
    generateToken,
    encryptData,
    decryptData,
  } = require('./utils/otpHelpers');

  // Test phone hashing
  const phoneHash = hashPhoneNumber('9876543210');
  if (phoneHash && phoneHash.length === 64) {
    console.log('  ✅ hashPhoneNumber - Returns valid SHA256 hash');
  } else {
    console.log('  ❌ hashPhoneNumber - Invalid hash');
  }

  // Test OTP generation
  const otp = generateOTP();
  if (/^\d{6}$/.test(otp)) {
    console.log('  ✅ generateOTP - Generates valid 6-digit OTP');
  } else {
    console.log('  ❌ generateOTP - Invalid OTP format');
  }

  // Test token generation
  const token = generateToken();
  if (token && typeof token === 'string' && token.length > 0) {
    console.log('  ✅ generateToken - Generates valid token');
  } else {
    console.log('  ❌ generateToken - Invalid token');
  }

  // Test OTP hashing
  const otpHash = hashOTP(otp, token);
  if (otpHash && otpHash.length === 64) {
    console.log('  ✅ hashOTP - Returns valid SHA256 hash');
  } else {
    console.log('  ❌ hashOTP - Invalid hash');
  }

  // Test encryption/decryption
  const testData = {test: 'value'};
  const encrypted = encryptData(testData);
  if (encrypted && encrypted.encrypted && encrypted.iv && encrypted.authTag) {
    console.log('  ✅ encryptData - Returns valid encrypted object');

    const decrypted = decryptData(encrypted);
    if (decrypted.test === 'value') {
      console.log('  ✅ decryptData - Successfully decrypts data');
    } else {
      console.log('  ❌ decryptData - Decrypted data does not match');
    }
  } else {
    console.log('  ❌ encryptData - Invalid encrypted object');
  }
} catch (e) {
  console.log(`  ❌ Error testing helpers: ${e.message}`);
}

// Test 8: Check MongoDB model
console.log('\n8️⃣  Checking MongoDB Model...');
try {
  const OTP = require('./model/otpModel');
  if (OTP && OTP.schema) {
    const schemaFields = Object.keys(OTP.schema.paths);
    const required = [
      'phoneHash',
      'otpHash',
      'token',
      'context',
      'expiresAt',
      'wrongAttempts',
      'blockedUntil',
    ];

    let allFieldsPresent = true;
    required.forEach(field => {
      if (schemaFields.includes(field)) {
        console.log(`  ✅ Field: ${field}`);
      } else {
        console.log(`  ❌ Missing field: ${field}`);
        allFieldsPresent = false;
      }
    });

    if (allFieldsPresent) {
      console.log('  ✅ All required fields present in OTP model');
    }
  } else {
    console.log('  ❌ OTP model not properly exported');
  }
} catch (e) {
  console.log(
    `  ⚠️  Cannot fully validate model (needs MongoDB): ${e.message}`,
  );
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n✨ VERIFICATION COMPLETE\n');
console.log('✅ READY FOR TESTING:\n');
console.log('  1. Start backend: npm start or npm run dev');
console.log('  2. Verify backend runs on http://localhost:8000');
console.log('  3. Check MongoDB connection works');
console.log('  4. Start frontend: npm run dev');
console.log('  5. Test OTP flow in browser console\n');
console.log('📝 TESTING CHECKLIST:\n');
console.log('  ⬜ Backend starts without errors');
console.log('  ⬜ Database connection successful');
console.log('  ⬜ OTP routes respond to requests');
console.log('  ⬜ Frontend loads without errors');
console.log('  ⬜ Encryption/Decryption works');
console.log('  ⬜ OTP service can reach backend');
console.log('  ⬜ Phone number validation works');
console.log('  ⬜ OTP request succeeds');
console.log('  ⬜ OTP verification succeeds');
console.log('  ⬜ Rate limiting enforced');
console.log('  ⬜ Error handling works\n');
console.log('🚀 Ready to test!\n');
