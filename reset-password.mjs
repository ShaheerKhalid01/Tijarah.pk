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

async function fix() {
  try {
    console.log('Connecting...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123456', salt);
    
    console.log('Updating user...');
    const result = await User.findOneAndUpdate(
      { email: 'admin@tijarah.pk' },
      { password: hash, role: 'admin' },
      { new: true }
    );
    
    console.log('✅ Password updated!');
    console.log('User:', result.email, result.role);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

fix();