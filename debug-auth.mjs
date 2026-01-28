import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

async function debug() {
  try {
    console.log('1. Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    console.log('2. Finding user with select(+password)...');
    const user = await User.findOne({ email: 'admin@tijarah.pk' }).select('+password');
    
    if (!user) {
      console.log('❌ User NOT found');
      process.exit(1);
    }
    
    console.log('✅ User found');
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Password exists:', !!user.password);
    console.log('   Password:', user.password);
    console.log();

    console.log('3. Testing password comparison...');
    const testPassword = 'admin123456';
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log('   Comparing:', testPassword);
    console.log('   Hash:', user.password);
    console.log('   Result:', isValid);
    console.log();

    if (isValid) {
      console.log('✅✅✅ PASSWORD IS CORRECT! ✅✅✅');
      console.log('The issue is in NextAuth config, not the password');
    } else {
      console.log('❌ Password does NOT match');
      console.log('Try hashing a new password...');
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(testPassword, salt);
      console.log('New hash:', newHash);
      console.log('Updating user with new hash...');
      await User.updateOne(
        { email: 'admin@tijarah.pk' },
        { password: newHash }
      );
      console.log('✅ Updated! Try again');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

debug();