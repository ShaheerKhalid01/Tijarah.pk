import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Check for user with exact email
    const userExact = await User.findOne({ email: email }).select('+password');
    
    // Check for user with lowercase email
    const userLower = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    // Check for user with uppercase email
    const userUpper = await User.findOne({ email: email.toUpperCase() }).select('+password');
    
    // Search for any user containing this email (case insensitive)
    const userRegex = await User.findOne({ 
      email: { $regex: email, $options: 'i' } 
    }).select('+password');

    return NextResponse.json({
      message: 'User check completed',
      email: email,
      results: {
        exact: userExact ? {
          email: userExact.email,
          name: userExact.name,
          role: userExact.role,
          hasPassword: !!userExact.password
        } : null,
        lowercase: userLower ? {
          email: userLower.email,
          name: userLower.name,
          role: userLower.role,
          hasPassword: !!userLower.password
        } : null,
        uppercase: userUpper ? {
          email: userUpper.email,
          name: userUpper.name,
          role: userUpper.role,
          hasPassword: !!userUpper.password
        } : null,
        regex: userRegex ? {
          email: userRegex.email,
          name: userRegex.name,
          role: userRegex.role,
          hasPassword: !!userRegex.password
        } : null
      }
    });
    
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json(
      { 
        message: 'Error checking user',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
