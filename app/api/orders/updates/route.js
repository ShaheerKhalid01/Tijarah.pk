import { connectToDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(request) {
  // Check if user is authenticated
  const session = await getServerSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Enable Server-Sent Events
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      console.log('[Order Updates SSE] Client connected');
      
      // Send initial connection message
      try {
        const data = `data: ${JSON.stringify({ type: 'connected', message: 'Connected to order updates' })}\n\n`;
        controller.enqueue(encoder.encode(data));
      } catch (error) {
        return;
      }

      // Function to send updates to this client
      const sendUpdate = (update) => {
        try {
          const data = `data: ${JSON.stringify(update)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          global.orderUpdateClients?.delete(sendUpdate);
        }
      };

      // Store the send function in a global map for broadcasting
      if (!global.orderUpdateClients) {
        global.orderUpdateClients = new Set();
      }
      
      global.orderUpdateClients.add(sendUpdate);

      // Clean up on disconnect
      const cleanup = () => {
        global.orderUpdateClients?.delete(sendUpdate);
      };

      request.signal.addEventListener('abort', cleanup);

      // Send keep-alive messages every 30 seconds
      const keepAlive = setInterval(() => {
        try {
          const data = `data: ${JSON.stringify({ type: 'ping' })}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          clearInterval(keepAlive);
          cleanup();
        }
      }, 30000);

      // Clean up interval on disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
      });

      // Handle potential errors
      request.signal.addEventListener('abort', () => {
        // Connection cleanup handled by cleanup function
      });
    },
    
    cancel() {
      // Connection cleanup handled by cleanup function
    }
  });

  return new Response(stream, { headers });
}

// Helper function to broadcast updates to all connected clients
export function broadcastOrderUpdate(update) {
  if (!global.orderUpdateClients) {
    return;
  }
  
  let successCount = 0;
  let failureCount = 0;
  
  global.orderUpdateClients.forEach(sendUpdate => {
    try {
      sendUpdate(update);
      successCount++;
    } catch (error) {
      global.orderUpdateClients.delete(sendUpdate);
      failureCount++;
    }
  });
}
