import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/config';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // Get headers for debugging
    const headersList = headers();
    const cookieHeader = headersList.get('cookie') || '';
    
    // Parse cookies manually
    const cookies = {};
    if (cookieHeader) {
      cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
      });
    }
    
    // Check for session tokens
    const hasSessionToken = !!cookies['next-auth.session-token'] || !!cookies['__Secure-next-auth.session-token'];
    
    // Try to get the session
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (sessionError) {
      console.error('Session error:', sessionError);
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to get session: ${sessionError.message}`,
        hasSessionToken
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      hasSession: !!session,
      hasSessionToken,
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
    console.error('Test session error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
