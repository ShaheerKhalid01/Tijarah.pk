import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './lib/db.js';
import User from './models/User.js';

async function resetAdminPassword() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    const email = 'admin@tijarah.pk';
    const newPassword = 'admin123456';
    
    console.log(`Finding user: ${email}`);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error('❌ Admin user not found!');
      process.exit(1);
    }
    
    console.log('Found user:', user.name);
    console.log('Hashing new password...');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('Updating password...');
    user.password = hashedPassword;
    await user.save();
    
    console.log('✅ Password reset successfully!');
    console.log(`Email: ${email}`);
    console.log(`New Password: ${newPassword}`);
    console.log('\nTry logging in now!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();