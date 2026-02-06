import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password, phone, role = 'user' } = await request.json();
    
    console.log('Registration attempt:', { name, email, phone, role });

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user (manually hash password since middleware is disabled)
    console.log('Creating new user...');
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Use hashed password
      phone,
      role,
      isVerified: true, // Auto-verify for simplicity
      preferences: {
        newsletter: true,
        notifications: true,
        theme: 'light'
      }
    });

    // Save user to database
    console.log('Saving user to database...');
    const result = await newUser.save();
    console.log('User saved successfully:', result.email);

    // Remove password from response
    const userObj = result.toObject();
    delete userObj.password;

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          ...userObj,
          id: userObj._id
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
