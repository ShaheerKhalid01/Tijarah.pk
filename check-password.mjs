import dotenv from 'dotenv';
import mongoose from 'mongoose';
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

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ email: 'admin@tijarah.pk' });
    
    if (!user) {
      console.log('❌ User not found!');
    } else {
      console.log('✅ User found:');
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Password hash:', user.password);
      console.log('Password length:', user.password?.length);
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

check();