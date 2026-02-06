import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return new Response(JSON.stringify({
      success: true,
      hasSession: !!session,
      session: session ? {
        user: session.user ? {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        } : null,
        expires: session.expires
      } : null
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
    
  } catch (error) {
    console.error('Session check error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
