import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import User model
import User from '../models/User.js';

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tijarah';

// Function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function createAdmin() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Check if admin user already exists
    const adminEmail = 'admin@tijarah.pk';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      await mongoose.disconnect();
      process.exit(0);
    }
    
    // Create or update admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          name: 'Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          isVerified: true,
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { 
        upsert: true, 
        new: true, 
        setDefaultsOnInsert: true 
      }
    );
    
    console.log('✅ Admin user created/updated successfully!');
    console.log('Email: admin@tijarah.pk');
    console.log('Password: admin123');
    
    // Close the connection
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('Make sure you have installed all required dependencies (mongoose, bcryptjs, dotenv)');
    }
    process.exit(1);
  }
}

createAdmin();
