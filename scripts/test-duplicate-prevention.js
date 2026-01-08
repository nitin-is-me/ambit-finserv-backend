/**
 * Test Script: Verify Duplicate Lead Prevention
 *
 * This script tests that the system prevents new duplicate lead_ids
 * by simulating multiple form submissions with the same phone number
 *
 * Usage: node scripts/test-duplicate-prevention.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const PhoneLeadMapping = require('../model/phoneLeadMappingModel');
const {getOrCreateLeadIdForPhone} = require('../utils/leadIdManager');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    // eslint-disable-next-line no-console
    console.log('✅ Connected to database\n');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const normalizePhone = phone => {
  if (!phone) return null;
  return phone.replace(/^\+91/, '').replace(/\s+/g, '').trim();
};

const testDuplicatePrevention = async () => {
  // eslint-disable-next-line no-console
  console.log('=== TESTING DUPLICATE LEAD PREVENTION ===\n');

  const testPhone = `9999${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')}`;
  const testPhoneVariations = [
    testPhone,
    `+91${testPhone}`,
    `+91 ${testPhone}`,
    `${testPhone.slice(0, 5)} ${testPhone.slice(5)}`,
  ];

  // eslint-disable-next-line no-console
  console.log(`Test Phone Number: ${testPhone}`);
  // eslint-disable-next-line no-console
  console.log(`Variations to test: ${testPhoneVariations.join(', ')}\n`);

  try {
    // Test 1: First submission - should create new lead_id
    // eslint-disable-next-line no-console
    console.log('Test 1: First submission (new phone number)');
    const leadId1 = await getOrCreateLeadIdForPhone(testPhone);
    // eslint-disable-next-line no-console
    console.log(`   ✅ Lead ID created: ${leadId1}`);

    // Verify mapping was created
    const mapping1 = await PhoneLeadMapping.findOne({
      mobile_number: normalizePhone(testPhone),
    });
    if (mapping1 && mapping1.lead_id === leadId1) {
      // eslint-disable-next-line no-console
      console.log('   ✅ Mapping created correctly');
    } else {
      // eslint-disable-next-line no-console
      console.error('   ❌ Mapping not found or incorrect');
      return false;
    }

    // Test 2: Second submission with same phone - should reuse lead_id
    // eslint-disable-next-line no-console
    console.log('\nTest 2: Second submission (same phone, different format)');
    const leadId2 = await getOrCreateLeadIdForPhone(`+91${testPhone}`);
    // eslint-disable-next-line no-console
    console.log(`   Lead ID returned: ${leadId2}`);

    if (leadId2 === leadId1) {
      // eslint-disable-next-line no-console
      console.log('   ✅ Same lead_id reused (no duplicate)');
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `   ❌ Different lead_id returned! Expected: ${leadId1}, Got: ${leadId2}`,
      );
      return false;
    }

    // Test 3: Third submission with spaces - should reuse lead_id
    // eslint-disable-next-line no-console
    console.log('\nTest 3: Third submission (phone with spaces)');
    const leadId3 = await getOrCreateLeadIdForPhone(
      `${testPhone.slice(0, 5)} ${testPhone.slice(5)}`,
    );
    // eslint-disable-next-line no-console
    console.log(`   Lead ID returned: ${leadId3}`);

    if (leadId3 === leadId1) {
      // eslint-disable-next-line no-console
      console.log('   ✅ Same lead_id reused (no duplicate)');
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `   ❌ Different lead_id returned! Expected: ${leadId1}, Got: ${leadId3}`,
      );
      return false;
    }

    // Test 4: Verify only ONE mapping exists
    // eslint-disable-next-line no-console
    console.log('\nTest 4: Verify mapping uniqueness');
    const allMappings = await PhoneLeadMapping.find({
      mobile_number: normalizePhone(testPhone),
    });

    if (allMappings.length === 1) {
      // eslint-disable-next-line no-console
      console.log(`   ✅ Only one mapping exists (${allMappings.length})`);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `   ❌ Multiple mappings found! Count: ${allMappings.length}`,
      );
      return false;
    }

    // Test 5: Test all variations return same lead_id
    // eslint-disable-next-line no-console
    console.log('\nTest 5: Test all phone number variations');
    let allSame = true;

    // Process variations sequentially
    // eslint-disable-next-line no-restricted-syntax
    for (const variation of testPhoneVariations) {
      // eslint-disable-next-line no-await-in-loop
      const leadId = await getOrCreateLeadIdForPhone(variation);
      if (leadId !== leadId1) {
        // eslint-disable-next-line no-console
        console.error(
          `   ❌ Variation "${variation}" returned different lead_id: ${leadId}`,
        );
        allSame = false;
      }
    }

    if (allSame) {
      // eslint-disable-next-line no-console
      console.log('   ✅ All variations return the same lead_id');
    } else {
      return false;
    }

    // Test 6: Concurrent requests simulation
    // eslint-disable-next-line no-console
    console.log('\nTest 6: Simulate concurrent requests');
    const concurrentPromises = [];
    for (let i = 0; i < 5; i += 1) {
      concurrentPromises.push(getOrCreateLeadIdForPhone(testPhone));
    }

    const concurrentResults = await Promise.all(concurrentPromises);
    const uniqueLeadIds = new Set(concurrentResults);

    if (uniqueLeadIds.size === 1 && concurrentResults[0] === leadId1) {
      // eslint-disable-next-line no-console
      console.log(
        `   ✅ All ${concurrentPromises.length} concurrent requests returned same lead_id`,
      );
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `   ❌ Concurrent requests returned different lead_ids: ${Array.from(uniqueLeadIds).join(', ')}`,
      );
      return false;
    }

    // Test 7: Verify database constraints
    // eslint-disable-next-line no-console
    console.log('\nTest 7: Verify database unique constraints');
    try {
      // Try to create duplicate mapping (should fail)
      await PhoneLeadMapping.create({
        mobile_number: normalizePhone(testPhone),
        lead_id: '999999', // Different lead_id
      });
      // eslint-disable-next-line no-console
      console.error('   ❌ Duplicate mapping created (should have failed)');
      return false;
    } catch (error) {
      if (error.code === 11000) {
        // eslint-disable-next-line no-console
        console.log(
          '   ✅ Database unique constraint prevents duplicate phone numbers',
        );
      } else {
        // eslint-disable-next-line no-console
        console.error(`   ❌ Unexpected error: ${error.message}`);
        return false;
      }
    }

    // Test 8: Verify lead_id uniqueness
    // eslint-disable-next-line no-console
    console.log('\nTest 8: Verify lead_id uniqueness constraint');
    try {
      // Try to create mapping with same lead_id but different phone (should fail)
      await PhoneLeadMapping.create({
        mobile_number: `9999${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0')}`,
        lead_id: leadId1,
      });
      // eslint-disable-next-line no-console
      console.error(
        '   ❌ Duplicate lead_id mapping created (should have failed)',
      );
      return false;
    } catch (error) {
      if (error.code === 11000) {
        // eslint-disable-next-line no-console
        console.log(
          '   ✅ Database unique constraint prevents duplicate lead_ids',
        );
      } else {
        // eslint-disable-next-line no-console
        console.error(`   ❌ Unexpected error: ${error.message}`);
        return false;
      }
    }

    // Cleanup test data
    // eslint-disable-next-line no-console
    console.log('\nCleaning up test data...');
    await PhoneLeadMapping.deleteOne({
      mobile_number: normalizePhone(testPhone),
    });
    // eslint-disable-next-line no-console
    console.log('   ✅ Test data cleaned up');

    // eslint-disable-next-line no-console
    console.log('\n=== ALL TESTS PASSED ===');
    // eslint-disable-next-line no-console
    console.log('✅ System correctly prevents duplicate lead_ids');
    // eslint-disable-next-line no-console
    console.log('✅ Phone number normalization works correctly');
    // eslint-disable-next-line no-console
    console.log('✅ Database constraints are working');
    // eslint-disable-next-line no-console
    console.log('✅ Concurrent requests handled correctly');

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('\n❌ Test failed with error:', error);
    return false;
  }
};

const main = async () => {
  try {
    await connectDB();
    const success = await testDuplicatePrevention();
    await mongoose.connection.close();

    if (success) {
      // eslint-disable-next-line no-console
      console.log('\n✅ All duplicate prevention tests passed!');
      process.exit(0);
    }
    // eslint-disable-next-line no-console
    console.log('\n❌ Some tests failed. Please review the output above.');
    process.exit(1);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Test execution failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

main();
