/**
 * Verification Script for Lead ID Mapping
 *
 * This script verifies that the lead_id mapping system is working correctly
 * Run this script to check for any duplicate mappings or inconsistencies
 *
 * Usage: node scripts/verify-lead-id-mapping.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const PhoneLeadMapping = require('../model/phoneLeadMappingModel');
const LoanApplications = require('../model/loanApplicationsModel');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    // eslint-disable-next-line no-console
    console.log('✅ Connected to database');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const verifyMappings = async () => {
  // eslint-disable-next-line no-console
  console.log('\n=== VERIFYING LEAD ID MAPPING SYSTEM ===\n');

  try {
    // 1. Check for duplicate lead_ids in mapping
    // eslint-disable-next-line no-console
    console.log('1. Checking for duplicate lead_ids in phone_lead_mapping...');
    const duplicateLeadIds = await PhoneLeadMapping.aggregate([
      {
        $group: {
          _id: '$lead_id',
          count: {$sum: 1},
          phones: {$push: '$mobile_number'},
        },
      },
      {
        $match: {count: {$gt: 1}},
      },
    ]);

    if (duplicateLeadIds.length > 0) {
      // eslint-disable-next-line no-console
      console.error('❌ FOUND DUPLICATE LEAD_IDS:');
      duplicateLeadIds.forEach(dup => {
        // eslint-disable-next-line no-console
        console.error(`   Lead ID: ${dup._id} appears ${dup.count} times`);
        // eslint-disable-next-line no-console
        console.error(`   Phone numbers: ${dup.phones.join(', ')}`);
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('✅ No duplicate lead_ids found');
    }

    // 2. Check for duplicate phone numbers in mapping
    // eslint-disable-next-line no-console
    console.log(
      '\n2. Checking for duplicate phone numbers in phone_lead_mapping...',
    );
    const duplicatePhones = await PhoneLeadMapping.aggregate([
      {
        $group: {
          _id: '$mobile_number',
          count: {$sum: 1},
          leadIds: {$push: '$lead_id'},
        },
      },
      {
        $match: {count: {$gt: 1}},
      },
    ]);

    if (duplicatePhones.length > 0) {
      // eslint-disable-next-line no-console
      console.error('❌ FOUND DUPLICATE PHONE NUMBERS:');
      duplicatePhones.forEach(dup => {
        // eslint-disable-next-line no-console
        console.error(`   Phone: ${dup._id} appears ${dup.count} times`);
        // eslint-disable-next-line no-console
        console.error(`   Lead IDs: ${dup.leadIds.join(', ')}`);
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('✅ No duplicate phone numbers found');
    }

    // 3. Check for phone numbers with multiple lead_ids
    // eslint-disable-next-line no-console
    console.log('\n3. Checking for phone numbers with multiple lead_ids...');
    const phonesWithMultipleLeads = await PhoneLeadMapping.aggregate([
      {
        $group: {
          _id: '$mobile_number',
          leadIds: {$addToSet: '$lead_id'},
        },
      },
      {
        $match: {'leadIds.1': {$exists: true}},
      },
    ]);

    if (phonesWithMultipleLeads.length > 0) {
      // eslint-disable-next-line no-console
      console.error('❌ FOUND PHONE NUMBERS WITH MULTIPLE LEAD_IDS:');
      phonesWithMultipleLeads.forEach(phone => {
        // eslint-disable-next-line no-console
        console.error(`   Phone: ${phone._id}`);
        // eslint-disable-next-line no-console
        console.error(`   Lead IDs: ${phone.leadIds.join(', ')}`);
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('✅ All phone numbers have exactly one lead_id');
    }

    // 4. Check for loan applications with same phone but different lead_ids
    // eslint-disable-next-line no-console
    console.log('\n4. Checking loan applications for consistency...');
    const inconsistentApps = await LoanApplications.aggregate([
      {
        $match: {
          mobile_number: {$exists: true, $ne: null},
          lead_id: {$exists: true, $ne: null},
        },
      },
      {
        $group: {
          _id: '$mobile_number',
          leadIds: {$addToSet: '$lead_id'},
          count: {$sum: 1},
        },
      },
      {
        $match: {'leadIds.1': {$exists: true}},
      },
    ]);

    if (inconsistentApps.length > 0) {
      // eslint-disable-next-line no-console
      console.warn('⚠️  FOUND LOAN APPLICATIONS WITH INCONSISTENT LEAD_IDS:');
      inconsistentApps.forEach(app => {
        // eslint-disable-next-line no-console
        console.warn(`   Phone: ${app._id} has ${app.count} applications`);
        // eslint-disable-next-line no-console
        console.warn(`   Lead IDs: ${app.leadIds.join(', ')}`);
      });
      // eslint-disable-next-line no-console
      console.warn(
        '   Note: This might be expected for allowedMultipleNumbers',
      );
    } else {
      // eslint-disable-next-line no-console
      console.log('✅ All loan applications are consistent');
    }

    // 5. Check for orphaned mappings (phone in mapping but no loan application)
    // eslint-disable-next-line no-console
    console.log('\n5. Checking for orphaned mappings...');
    const allMappings = await PhoneLeadMapping.find({});
    let orphanedCount = 0;

    // Process mappings sequentially
    // eslint-disable-next-line no-restricted-syntax
    for (const mapping of allMappings) {
      // eslint-disable-next-line no-await-in-loop
      const app = await LoanApplications.findOne({
        mobile_number: mapping.mobile_number,
      });
      if (!app) {
        orphanedCount += 1;
        // eslint-disable-next-line no-console
        console.warn(
          `   ⚠️  Orphaned mapping: ${mapping.mobile_number} -> ${mapping.lead_id}`,
        );
      }
    }

    if (orphanedCount === 0) {
      // eslint-disable-next-line no-console
      console.log('✅ No orphaned mappings found');
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `⚠️  Found ${orphanedCount} orphaned mapping(s) (may be expected)`,
      );
    }

    // 6. Check for loan applications without mappings
    // eslint-disable-next-line no-console
    console.log('\n6. Checking for loan applications without mappings...');
    const appsWithoutMapping = await LoanApplications.aggregate([
      {
        $match: {
          mobile_number: {$exists: true, $ne: null},
          lead_id: {$exists: true, $ne: null},
        },
      },
      {
        $lookup: {
          from: 'phone_lead_mappings',
          localField: 'mobile_number',
          foreignField: 'mobile_number',
          as: 'mapping',
        },
      },
      {
        $match: {mapping: {$size: 0}},
      },
      {
        $project: {
          mobile_number: 1,
          lead_id: 1,
        },
      },
    ]);

    if (appsWithoutMapping.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `⚠️  Found ${appsWithoutMapping.length} loan application(s) without mappings:`,
      );
      appsWithoutMapping.slice(0, 10).forEach(app => {
        // eslint-disable-next-line no-console
        console.warn(`   Phone: ${app.mobile_number}, Lead ID: ${app.lead_id}`);
      });
      if (appsWithoutMapping.length > 10) {
        // eslint-disable-next-line no-console
        console.warn(`   ... and ${appsWithoutMapping.length - 10} more`);
      }
      // eslint-disable-next-line no-console
      console.warn(
        '   Note: These will be handled automatically on next submission',
      );
    } else {
      // eslint-disable-next-line no-console
      console.log('✅ All loan applications have mappings');
    }

    // 7. Statistics
    // eslint-disable-next-line no-console
    console.log('\n=== STATISTICS ===');
    const totalMappings = await PhoneLeadMapping.countDocuments();
    const totalApps = await LoanApplications.countDocuments({
      mobile_number: {$exists: true, $ne: null},
    });
    const appsWithLeadId = await LoanApplications.countDocuments({
      lead_id: {$exists: true, $ne: null},
    });

    // eslint-disable-next-line no-console
    console.log(`Total mappings: ${totalMappings}`);
    // eslint-disable-next-line no-console
    console.log(`Total loan applications: ${totalApps}`);
    // eslint-disable-next-line no-console
    console.log(`Loan applications with lead_id: ${appsWithLeadId}`);

    // Summary
    // eslint-disable-next-line no-console
    console.log('\n=== SUMMARY ===');
    const hasIssues =
      duplicateLeadIds.length > 0 ||
      duplicatePhones.length > 0 ||
      phonesWithMultipleLeads.length > 0;

    if (hasIssues) {
      // eslint-disable-next-line no-console
      console.error('❌ ISSUES FOUND - Please review the errors above');
      process.exit(1);
    } else {
      // eslint-disable-next-line no-console
      console.log('✅ All checks passed! System is working correctly.');
      process.exit(0);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error during verification:', error);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await verifyMappings();
  await mongoose.connection.close();
  // eslint-disable-next-line no-console
  console.log('\n✅ Verification complete');
};

main();
