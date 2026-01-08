/**
 * Migration Script: Create mappings for existing loan applications
 *
 * This script:
 * 1. Creates mappings for all existing loan applications with lead_id
 * 2. For phones with multiple lead_ids, uses the most recent one
 * 3. Ensures backward compatibility
 *
 * Usage: node scripts/migrate-existing-lead-ids.js
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

const normalizePhone = phone => {
  if (!phone) return null;
  return phone.replace(/^\+91/, '').replace(/\s+/g, '').trim();
};

const migrateMappings = async () => {
  // eslint-disable-next-line no-console
  console.log('\n=== MIGRATING EXISTING LEAD IDS ===\n');

  try {
    // Get all loan applications with lead_id
    const appsWithLeadId = await LoanApplications.find({
      mobile_number: {$exists: true, $ne: null},
      lead_id: {$exists: true, $ne: null},
    }).sort({createdAt: -1}); // Sort by most recent first

    // eslint-disable-next-line no-console
    console.log(
      `Found ${appsWithLeadId.length} loan applications with lead_id\n`,
    );

    // Group by normalized phone number, keeping the most recent lead_id
    const phoneToLeadMap = new Map();

    appsWithLeadId.forEach(app => {
      const normalizedPhone = normalizePhone(app.mobile_number);
      if (!normalizedPhone || !app.lead_id) return;

      // If phone already seen, keep the first one (most recent due to sort)
      if (!phoneToLeadMap.has(normalizedPhone)) {
        phoneToLeadMap.set(normalizedPhone, {
          lead_id: app.lead_id,
          createdAt: app.createdAt,
        });
      }
    });

    // eslint-disable-next-line no-console
    console.log(`Found ${phoneToLeadMap.size} unique phone numbers\n`);

    // Check existing mappings
    const existingMappings = await PhoneLeadMapping.find({});
    const existingPhones = new Set(
      existingMappings.map(m => normalizePhone(m.mobile_number)),
    );

    // eslint-disable-next-line no-console
    console.log(`Existing mappings: ${existingMappings.length}\n`);

    // Create mappings for phones that don't have one
    let created = 0;
    let skipped = 0;
    let errors = 0;
    const errorsList = [];

    const entries = Array.from(phoneToLeadMap.entries());

    // Process entries sequentially to avoid race conditions
    // eslint-disable-next-line no-restricted-syntax
    for (const [phone, data] of entries) {
      try {
        // Skip if mapping already exists
        if (existingPhones.has(phone)) {
          skipped += 1;
          // eslint-disable-next-line no-continue
          continue;
        }

        // Check if lead_id is already used by another phone
        // eslint-disable-next-line no-await-in-loop
        const existingMappingWithLeadId = await PhoneLeadMapping.findOne({
          lead_id: data.lead_id,
        });

        if (existingMappingWithLeadId) {
          // eslint-disable-next-line no-console
          console.warn(
            `⚠️  Lead ID ${data.lead_id} already mapped to ${existingMappingWithLeadId.mobile_number}, skipping ${phone}`,
          );
          skipped += 1;
          // eslint-disable-next-line no-continue
          continue;
        }

        // Create new mapping
        // eslint-disable-next-line no-await-in-loop
        await PhoneLeadMapping.create({
          mobile_number: phone,
          lead_id: data.lead_id,
        });

        created += 1;
        if (created % 100 === 0) {
          // eslint-disable-next-line no-console
          console.log(`   Created ${created} mappings...`);
        }
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error - mapping already exists (race condition)
          skipped += 1;
        } else {
          errors += 1;
          errorsList.push({phone, error: error.message});
          // eslint-disable-next-line no-console
          console.error(
            `❌ Error creating mapping for ${phone}:`,
            error.message,
          );
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log('\n=== MIGRATION SUMMARY ===');
    // eslint-disable-next-line no-console
    console.log(`✅ Created: ${created} mappings`);
    // eslint-disable-next-line no-console
    console.log(`⏭️  Skipped: ${skipped} (already exist or conflicts)`);
    // eslint-disable-next-line no-console
    console.log(`❌ Errors: ${errors}`);

    if (errorsList.length > 0) {
      // eslint-disable-next-line no-console
      console.log('\n⚠️  Errors encountered:');
      errorsList.slice(0, 10).forEach(err => {
        // eslint-disable-next-line no-console
        console.log(`   ${err.phone}: ${err.error}`);
      });
      if (errorsList.length > 10) {
        // eslint-disable-next-line no-console
        console.log(`   ... and ${errorsList.length - 10} more`);
      }
    }

    // Verify migration
    // eslint-disable-next-line no-console
    console.log('\n=== VERIFICATION ===');
    const totalMappings = await PhoneLeadMapping.countDocuments();
    // eslint-disable-next-line no-console
    console.log(`Total mappings after migration: ${totalMappings}`);

    // Check for phones with multiple lead_ids in loan applications
    // Get all apps and normalize in JavaScript (more compatible)
    const allApps = await LoanApplications.find({
      mobile_number: {$exists: true, $ne: null},
      lead_id: {$exists: true, $ne: null},
    }).select('mobile_number lead_id');

    const phoneGroups = {};
    allApps.forEach(app => {
      const normalized = normalizePhone(app.mobile_number);
      if (!normalized) return;

      if (!phoneGroups[normalized]) {
        phoneGroups[normalized] = new Set();
      }
      phoneGroups[normalized].add(app.lead_id);
    });

    const phonesWithMultipleLeads = Object.entries(phoneGroups)
      .filter(([, leadIds]) => leadIds.size > 1)
      .map(([phone, leadIds]) => ({
        phone,
        leadIds: Array.from(leadIds),
        count: leadIds.size,
      }));

    // eslint-disable-next-line no-console
    console.log(
      `\n⚠️  Phones with multiple lead_ids in loan applications: ${phonesWithMultipleLeads.length}`,
    );
    // eslint-disable-next-line no-console
    console.log(
      '   Note: These are historical records. New submissions will use the mapped lead_id.',
    );

    if (phonesWithMultipleLeads.length > 0) {
      // eslint-disable-next-line no-console
      console.log('\n   Sample phones with multiple lead_ids:');
      const samples = phonesWithMultipleLeads.slice(0, 5);

      // Process samples sequentially
      // eslint-disable-next-line no-restricted-syntax
      for (const phoneData of samples) {
        // eslint-disable-next-line no-await-in-loop
        const mapping = await PhoneLeadMapping.findOne({
          mobile_number: phoneData.phone,
        });
        if (mapping) {
          // eslint-disable-next-line no-console
          console.log(
            `   ${phoneData.phone}: ${phoneData.leadIds.length} lead_ids, using mapped: ${mapping.lead_id}`,
          );
        } else {
          // eslint-disable-next-line no-console
          console.log(
            `   ${phoneData.phone}: ${phoneData.leadIds.length} lead_ids, no mapping yet`,
          );
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log('\n✅ Migration complete!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error during migration:', error);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    await migrateMappings();
    await mongoose.connection.close();
    // eslint-disable-next-line no-console
    console.log('\n✅ All done!');
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

main();
