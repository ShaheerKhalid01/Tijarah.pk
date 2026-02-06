import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();
    
    console.log('Test register received:', { name, email, phone });

    // Just test database connection
    await connectDB();
    
    return NextResponse.json(
      { 
        message: 'Test registration successful',
        received: { name, email, phone }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Test registration error:', error);
    return NextResponse.json(
      { message: 'Test registration failed: ' + error.message },
      { status: 500 }
    );
  }
}
