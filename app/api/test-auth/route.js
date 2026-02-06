import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Test Auth - Session:', session);
    
    return NextResponse.json({
      authenticated: !!session,
      session: session
    });
  } catch (error) {
    console.error('Test Auth Error:', error);
    return NextResponse.json(
      { error: 'Failed to check authentication', details: error.message },
      { status: 500 }
    );
  }
}
