import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/config'; // Adjusted path to point to global config loc
import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is admin
        // Note: Assuming 'admin' role is required. Adjust if 'superadmin' etc is used.
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch all chats, sorted by latest update
        // Limit to 50 for performance, potentially add pagination later
        const chats = await Chat.find({}).sort({ updatedAt: -1 }).limit(50);

        return NextResponse.json({ chats });
    } catch (error) {
        console.error('Admin Chats API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
