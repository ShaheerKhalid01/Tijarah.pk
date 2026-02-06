import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Get all users and return their emails (without passwords)
    const users = await User.find({}, 'email name role createdAt').sort({ createdAt: -1 });
    
    return NextResponse.json({
      message: 'Users found',
      count: users.length,
      users: users.map(user => ({
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }))
    });
    
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json(
      { 
        message: 'Error fetching users',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
