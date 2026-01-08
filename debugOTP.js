/**
 * OTP Debug & Test Script
 * Run this to test the OTP flow and identify issues
 */

const mongoose = require('mongoose');
require('dotenv').config();

const OTP = require('./model/otpModel');
const {
  hashPhoneNumber,
  generateOTP,
  generateToken,
  hashOTP,
} = require('./utils/otpHelpers');

async function debugOTP() {
  try {
    console.log('\n🧪 OTP DEBUG & TEST SCRIPT\n');
    console.log('='.repeat(60));

    // Connect to database
    console.log('\n1️⃣  Connecting to Database...');
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.DATABASE_URL);
    }
    console.log('✅ Database connected\n');

    // Check OTP collection
    console.log('2️⃣  Checking OTP Collection...');
    const otpCount = await OTP.countDocuments();
    console.log(`✅ Total OTP records: ${otpCount}`);

    // Get recent records
    console.log('\n3️⃣  Recent OTP Records (last 10)...');
    const recentOTPs = await OTP.find().sort({createdAt: -1}).limit(10).lean();

    if (recentOTPs.length === 0) {
      console.log('⚠️  No OTP records found');
    } else {
      recentOTPs.forEach((record, index) => {
        console.log(`\n  Record ${index + 1}:`);
        console.log(`    Phone Hash: ${record.phoneHash.substring(0, 20)}...`);
        console.log(`    Token: ${record.token}`);
        console.log(`    Context: ${record.context}`);
        console.log(`    Created: ${record.createdAt}`);
        console.log(`    Expires At: ${record.expiresAt}`);
        console.log(`    Verified: ${record.verified}`);
        console.log(`    Wrong Attempts: ${record.wrongAttempts}`);
        console.log(
          `    Blocked Until: ${record.blockedUntil || 'Not blocked'}`,
        );
      });
    }

    // Test rate limiting logic
    console.log('\n4️⃣  Testing Rate Limiting Logic...');
    const testPhone = '9876543210';
    const testPhoneHash = hashPhoneNumber(testPhone);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const phoneRecords = await OTP.find({
      phoneHash: testPhoneHash,
      context: 'public',
      createdAt: {$gte: oneHourAgo},
    }).lean();

    console.log(
      `✅ Records for ${testPhone} in last hour: ${phoneRecords.length}`,
    );
    if (phoneRecords.length > 0) {
      phoneRecords.forEach((record, index) => {
        console.log(
          `  ${index + 1}. Created: ${record.createdAt}, Verified: ${record.verified}`,
        );
      });
    }

    // Test OTP generation
    console.log('\n5️⃣  Testing OTP Generation...');
    const testOTP = generateOTP();
    console.log(`✅ Generated OTP: ${testOTP}`);
    if (!/^\d{6}$/.test(testOTP)) {
      console.log('❌ OTP format invalid!');
    } else {
      console.log('✅ OTP format valid');
    }

    // Test token generation
    console.log('\n6️⃣  Testing Token Generation...');
    const testToken = generateToken();
    console.log(`✅ Generated Token: ${testToken}`);

    // Test hashing
    console.log('\n7️⃣  Testing Hashing...');
    const phoneHash = hashPhoneNumber(testPhone);
    console.log(`✅ Phone Hash: ${phoneHash}`);
    const otpHash = hashOTP(testOTP, testToken);
    console.log(`✅ OTP Hash: ${otpHash}`);

    // Check database indexes
    console.log('\n8️⃣  Checking Database Indexes...');
    const indexes = await OTP.collection.getIndexes();
    console.log('✅ Indexes:');
    Object.keys(indexes).forEach(indexName => {
      console.log(`  - ${indexName}`);
    });

    // Test creating an OTP record
    console.log('\n9️⃣  Testing OTP Record Creation...');
    const testRecord = await OTP.create({
      phoneHash: testPhoneHash,
      otpHash: otpHash,
      otp: testOTP,
      token: testToken,
      context: 'test-debug',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      wrongAttempts: 0,
    });
    console.log(`✅ Record created: ${testRecord._id}`);
    console.log(`   Phone Hash: ${testRecord.phoneHash.substring(0, 20)}...`);
    console.log(`   Token: ${testRecord.token}`);

    // Clean up test record
    await OTP.deleteOne({_id: testRecord._id});
    console.log('✅ Test record cleaned up');

    console.log('\n' + '='.repeat(60));
    console.log('\n✨ DEBUG COMPLETE\n');
    console.log('RECOMMENDATIONS:');
    console.log('1. Check backend is running on correct port');
    console.log('2. Check SMS gateway credentials in .env');
    console.log('3. Ensure frontend has correct NEXT_PUBLIC_BACKEND_URL');
    console.log('4. Ensure encryption keys match between frontend & backend');
    console.log('5. Test OTP request via curl or Postman');
    console.log('6. Monitor backend logs for errors\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  }
}

debugOTP();
