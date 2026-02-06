import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Connect to database
    await connectToDatabase();
    
    const { email, password, name } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return Response.json(
        { error: 'Admin user already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create admin user
    const adminUser = await User.create({
      name: name || 'Admin',
      email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return Response.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
    
  } catch (error) {
    console.error('Error creating admin:', error);
    return Response.json(
      { error: 'Failed to create admin user', message: error.message },
      { status: 500 }
    );
  }
}
