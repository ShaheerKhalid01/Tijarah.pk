import mongoose from 'mongoose';

export async function GET() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return Response.json({ error: 'MONGODB_URI not set' }, { status: 500 });
    }
    
    await mongoose.connect(MONGODB_URI);
    await mongoose.disconnect();
    
    return Response.json({ 
      success: true, 
      message: 'Database connection successful',
      database: MONGODB_URI.split('@')[1]?.split('/')[0] || 'Unknown'
    });
    
  } catch (error) {
    return Response.json({ 
      error: 'Connection failed', 
      message: error.message 
    }, { status: 500 });
  }
}
