import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Count users
    const userCount = await prisma.user.count();
    
    // Get first user (if exists)
    const firstUser = await prisma.user.findFirst();
    
    return new Response(JSON.stringify({
      success: true,
      userCount,
      firstUser: firstUser ? {
        id: firstUser.id,
        email: firstUser.email,
        role: firstUser.role
      } : null
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
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
  } finally {
    await prisma.$disconnect();
  }
}
