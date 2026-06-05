#!/usr/bin/env node
/**
 * scripts/seed-db.js
 *
 * Seeds MongoDB with sample data for local development.
 * Reuses the mock data shipped with the frontend (packages/shared/data/mockData.js)
 * and the backend models (apps/backend/src/models/*).
 *
 * Usage:
 *   node scripts/seed-db.js
 *   node scripts/seed-db.js --reset    # drop existing collections first
 */
import 'dotenv/config';
import mongoose from 'mongoose';

const RESET = process.argv.includes('--reset');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jinalaya';

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('🪔 Connected to MongoDB');

  // TODO: import models + mock data and bulk-insert.
  // Example:
  //   const Donation = (await import('../apps/backend/src/models/Donation.js')).default;
  //   const { donationsList } = await import('../packages/shared/data/mockData.js');
  //   if (RESET) await Donation.deleteMany({});
  //   await Donation.insertMany(donationsList);

  console.log('Seed complete.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
