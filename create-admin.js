const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const prisma = new PrismaClient();
  
  try {
    const adminEmail = 'admin@tijarah.pk';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`Email: ${adminEmail}`);
      return;
    }

    // Create new admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        emailVerified: new Date()
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\nYou can now log in to the admin panel with these credentials.');
  } catch (error) {
    console.error('❌ Error creating admin user:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createAdmin();
