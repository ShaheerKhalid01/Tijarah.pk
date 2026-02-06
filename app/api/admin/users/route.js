import { connectToDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/config';
import User from '@/models/User';

/**
 * GET /api/admin/users
 * Returns all users (admin only)
 */
export async function GET(request) {
  try {
    // Check admin auth
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get all users
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100);

    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error('[Users API Error]:', error);
    return Response.json(
      { error: 'Failed to fetch users', message: error.message },
      { status: 500 }
    );
  }
}