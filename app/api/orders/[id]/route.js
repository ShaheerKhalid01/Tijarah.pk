import { connectToDatabase } from '@/lib/db';

/**
 * PATCH /api/orders/[id]
 * Update an existing order (client-side)
 */
export async function PATCH(request, { params }) {
  console.log('=== [Orders API] PATCH /[id] ===');
  
  // Extract ID from URL if params is empty (Next.js App Router issue)
  let orderId = params?.id;
  if (!orderId && request.url) {
    const urlParts = request.url.split('/');
    orderId = urlParts[urlParts.length - 1];
    console.log('[Orders API] Extracted ID from URL:', orderId);
  }
  
  console.log('[Orders API] Final orderId:', orderId);

  try {
    await connectToDatabase();

    // Import Order model
    let Order;
    try {
      Order = (await import('@/models/Order')).default;
    } catch (modelError) {
      console.error('[Orders API] Failed to import Order model:', modelError.message);
      return Response.json(
        { error: 'Order model not found', message: modelError.message },
        { status: 500 }
      );
    }

    // Get request body
    const body = await request.json();
    console.log('[Orders API] Request body:', body);

    // Find and update the order
    let order = null;

    // First try by _id
    try {
      order = await Order.findByIdAndUpdate(
        orderId,
        {
          ...body,
          updatedAt: new Date(),
        },
        { new: true, lean: true }
      );
      if (order) {
        console.log('[Orders API] Found order by _id:', orderId);
      }
    } catch (mongoError) {
      console.log('[Orders API] Failed to find by _id:', orderId, mongoError.message);
    }

    // If not found, try by orderNumber
    if (!order) {
      try {
        order = await Order.findOneAndUpdate(
          { orderNumber: orderId },
          {
            ...body,
            updatedAt: new Date(),
          },
          { new: true, lean: true }
        );
        if (order) {
          console.log('[Orders API] Found order by orderNumber:', orderId);
        }
      } catch (mongoError) {
        console.log('[Orders API] Failed to find by orderNumber:', orderId, mongoError.message);
      }
    }

    if (!order) {
      // Get all available orders for debugging
      const allOrders = await Order.find({})
        .select('_id orderNumber status')
        .lean();
      
      console.log('[Orders API] Available orders:', allOrders);
      
      return Response.json({
        error: 'Order not found',
        orderId: orderId,
        candidatesTried: [orderId],
        availableOrders: allOrders.length,
        allOrderIds: allOrders.map(o => ({
          id: o._id,
          orderNumber: o.orderNumber,
          status: o.status
        }))
      }, { status: 404 });
    }

    console.log('[Orders API] Order updated successfully:', order._id);

    // Broadcast the update to all connected clients
    try {
      const broadcastResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orders/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'order_updated',
          data: order
        })
      });
      
      if (broadcastResponse.ok) {
        console.log('[Orders API] Update broadcasted successfully');
      } else {
        console.log('[Orders API] Failed to broadcast update');
      }
    } catch (broadcastError) {
      console.log('[Orders API] Broadcast error:', broadcastError.message);
    }

    return Response.json(order, { status: 200 });

  } catch (error) {
    console.error('[Orders API] Error updating order:', error);
    return Response.json(
      { error: 'Failed to update order', message: error.message },
      { status: 500 }
    );
  }
}
