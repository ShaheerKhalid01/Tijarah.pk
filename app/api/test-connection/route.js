// app/api/test-connection/route.js
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    await connectToDatabase();
    return new Response(
      JSON.stringify({ success: true, message: 'Successfully connected to MongoDB' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Connection test failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to connect to MongoDB',
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}