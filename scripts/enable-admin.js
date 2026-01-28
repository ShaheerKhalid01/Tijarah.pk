/**
 * Enable Admin Account Script
 * 
 * Enables the admin account if it's currently disabled
 * 
 * Usage: node scripts/enable-admin.js
 * Or: npm run enable-admin (after adding to package.json)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: '.env.local' });

// Get directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define User model (same as in models/User.js)
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function enableAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find admin user
    console.log('🔍 Looking for admin user: admin@tijarah.pk\n');
    const admin = await User.findOne({ email: 'admin@tijarah.pk' });

    if (!admin) {
      console.error('❌ Admin user not found!');
      console.error('\nThe user admin@tijarah.pk does not exist in the database.');
      console.error('Please run: node scripts/create-admin.js\n');
      process.exit(1);
    }

    console.log('📋 User Information:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Status: ${admin.active ? '✅ Active' : '❌ Disabled'}`);
    console.log(`   Verified: ${admin.isVerified ? '✅ Yes' : '❌ No'}\n`);

    if (admin.active && admin.isVerified) {
      console.log('✅ Account is already active and verified!');
      console.log('\nYou can login with:');
      console.log('   Email: admin@tijarah.pk');
      console.log('   Password: (your password)\n');
      process.exit(0);
    }

    // Enable account
    let updated = false;

    if (!admin.active) {
      console.log('🔓 Enabling account...');
      admin.active = true;
      updated = true;
    }

    if (!admin.isVerified) {
      console.log('✓ Marking as verified...');
      admin.isVerified = true;
      updated = true;
    }

    if (updated) {
      await admin.save();
      console.log('\n✅ Account updated successfully!\n');
    }

    console.log('📊 Updated Status:');
    console.log(`   Active: ${admin.active ? '✅ Yes' : '❌ No'}`);
    console.log(`   Verified: ${admin.isVerified ? '✅ Yes' : '❌ No'}`);

    console.log('\n🎉 You can now login with:');
    console.log('   URL: http://localhost:3000/en/admin-auth/login');
    console.log('   Email: admin@tijarah.pk');
    console.log('   Password: (your password)\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check MONGODB_URI is set in .env.local');
    console.error('2. Verify MongoDB connection is working');
    console.error('3. Make sure admin user exists in database\n');
    process.exit(1);
  }
}

// Run the function
console.log('🚀 Enabling Admin Account...\n');
enableAdmin();