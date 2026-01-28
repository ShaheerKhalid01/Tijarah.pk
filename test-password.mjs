import bcrypt from 'bcryptjs';

const storedHash = '$2b$10$9ko/blb6NQUCqrrmhhTpEeU01CAsIUoCL8yX8C9HrRVrgOCjwHwE6';
const passwordToTest = 'admin123456';

async function test() {
  try {
    const isValid = await bcrypt.compare(passwordToTest, storedHash);
    console.log('Password comparison result:', isValid);
    
    if (isValid) {
      console.log('✅ Password matches!');
    } else {
      console.log('❌ Password does NOT match');
    }
    
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

test();