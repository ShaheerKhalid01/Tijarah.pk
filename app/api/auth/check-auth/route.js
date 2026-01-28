import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/config.js';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(
        JSON.stringify({ 
          authenticated: false,
          error: 'No active session found' 
        }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        authenticated: true,
        session: {
          user: {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role || 'user',
            name: session.user.name
          },
          expires: session.expires
        }
      }), 
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      }
    );

  } catch (error) {
    console.error('Auth check error:', error);
    return new Response(
      JSON.stringify({ 
        authenticated: false, 
        error: error.message || 'Authentication check failed' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
