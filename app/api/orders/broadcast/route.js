import { broadcastOrderUpdate } from '../updates/route';

export async function POST(request) {
  try {
    const updateData = await request.json();
    
    // Broadcast the update to all connected clients
    const result = broadcastOrderUpdate(updateData);
    
    return Response.json({
      success: true,
      message: 'Update broadcasted successfully',
      update: updateData
    });
  } catch (error) {
    console.error('[Broadcast] Error:', error);
    return Response.json({
      success: false,
      error: 'Failed to broadcast update',
      message: error.message
    }, { status: 500 });
  }
}
