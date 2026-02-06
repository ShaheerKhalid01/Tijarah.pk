import { connectToDatabase } from '@/lib/db';

/**
 * GET /api/admin/orders/[id]
 * Fetch single order (debug / optional)
 */
export async function GET(request, { params }) {
  console.log('=== [Admin Orders API] GET /[id] ===');
  console.log('Params.id:', params.id);

  try {
    await connectToDatabase();

    let Order;
    try {
      Order = (await import('@/models/Order')).default;
    } catch (modelError) {
      console.error('[Admin Orders API] Failed to import Order model:', modelError.message);
      return Response.json(
        { error: 'Order model not found', message: modelError.message },
        { status: 500 }
      );
    }

    const allOrders = await Order.find({}).select('_id orderNumber status').lean();

    // Try by _id first, then by orderNumber
    let order =
      (await Order.findById(params.id)) ||
      (await Order.findOne({ orderNumber: params.id }));

    if (!order) {
      return Response.json(
        {
          error: 'Order not found',
          orderId: params.id,
          availableOrders: allOrders.length,
          allOrderIds: allOrders.map(o => ({
            id: o._id.toString(),
            orderNumber: o.orderNumber,
            status: o.status,
          })),
        },
        { status: 404 }
      );
    }

    return Response.json({ order, allOrders: allOrders.length }, { status: 200 });
  } catch (error) {
    console.error('[Admin Orders API GET Error]:', error.message);
    return Response.json(
      { error: 'Failed to fetch order', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/orders/[id]
 * Updates order status (admin only)
 * More tolerant about the ID format (supports _id and orderNumber).
 */
export async function PATCH(request, { params }) {
  console.log('=== [Admin Orders API] PATCH /[id] ===');
  console.log('[Admin Orders API] Full params object:', params);
  console.log('[Admin Orders API] Params keys:', Object.keys(params || {}));
  
  // Extract ID from URL if params is empty (Next.js App Router issue)
  let orderId = params?.id;
  if (!orderId && request.url) {
    const urlParts = request.url.split('/');
    orderId = urlParts[urlParts.length - 1]; // Get last part of URL
    console.log('[Admin Orders API] Extracted ID from URL:', orderId);
  }
  
  console.log('[Admin Orders API] Final orderId:', orderId);
  console.log('[Admin Orders API] OrderId type:', typeof orderId);
  console.log('[Admin Orders API] OrderId length:', orderId?.length);

  try {
    await connectToDatabase();

    // Import Order model
    let Order;
    try {
      Order = (await import('@/models/Order')).default;
    } catch (modelError) {
      console.error('[Admin Orders API] Failed to import Order model:', modelError.message);
      return Response.json(
        { error: 'Order model not found', message: modelError.message },
        { status: 500 }
      );
    }

    // Get request body
    const body = await request.json();
    console.log('[Admin Orders API] Request body:', body);

    const idFromParams = orderId;
    const idFromBody = body.orderId;

    const candidateIds = Array.from(
      new Set(
        [idFromParams, idFromBody]
          .filter(Boolean)
          .map(v => (typeof v === 'string' ? v.trim() : String(v)))
      )
    );

    console.log('[Admin Orders API] idFromParams:', idFromParams);
    console.log('[Admin Orders API] idFromBody:', idFromBody);
    console.log('[Admin Orders API] Candidate IDs:', candidateIds);
    console.log('[Admin Orders API] Candidate IDs length:', candidateIds.length);

    let order = null;

    // 1) Try each candidate as a Mongo _id
    for (const candidate of candidateIds) {
      try {
        order = await Order.findByIdAndUpdate(
          candidate,
          {
            ...body,
            updatedAt: new Date(),
          },
          { new: true, lean: true }
        );
        if (order) {
          console.log('[Admin Orders API] Found order by _id:', candidate);
          break;
        }
      } catch (mongoError) {
        console.log('[Admin Orders API] Failed to find by _id:', candidate, mongoError.message);
        continue;
      }
    }

    // 2) If not found, try as orderNumber
    if (!order) {
      for (const candidate of candidateIds) {
        try {
          order = await Order.findOneAndUpdate(
            { orderNumber: candidate },
            {
              ...body,
              updatedAt: new Date(),
            },
            { new: true, lean: true }
          );
          if (order) {
            console.log('[Admin Orders API] Found order by orderNumber:', candidate);
            break;
          }
        } catch (mongoError) {
          console.log('[Admin Orders API] Failed to find by orderNumber:', candidate, mongoError.message);
          continue;
        }
      }
    }

    if (!order) {
      // Get all orders for debugging
      const allOrders = await Order.find({}).select('_id orderNumber status').lean();
      console.error('[Admin Orders API] Order not found. Debug info:', {
        candidateIds,
        candidatesTried: candidateIds,
        availableOrders: allOrders.length,
        allOrderIds: allOrders.map(o => ({
          id: o._id.toString(),
          orderNumber: o.orderNumber,
          status: o.status,
        })),
      });
      return Response.json(
        { error: 'Order not found', candidatesTried: candidateIds, availableOrders: allOrders.length, allOrderIds: allOrders.map(o => ({id: o._id.toString(), orderNumber: o.orderNumber, status: o.status})) },
        { status: 404 }
      );
    }

    console.log('[Admin Orders API] Order updated successfully:', order._id);
    
    // Broadcast the update to all connected clients
    try {
      const broadcastResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orders/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'order_status_changed',
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          newStatus: order.status,
          timestamp: new Date().toISOString()
        })
      });
      
      if (broadcastResponse.ok) {
        console.log('[Admin Orders API] Update broadcasted successfully');
      } else {
        console.error('[Admin Orders API] Failed to broadcast update');
      }
    } catch (broadcastError) {
      console.error('[Admin Orders API] Broadcast error:', broadcastError);
    }
    
    return Response.json(order, { status: 200 });
  } catch (error) {
    console.error('[Admin Orders API PATCH Error]:', error.message);
    console.error('[Admin Orders API PATCH Stack]:', error.stack);
    return Response.json(
      { error: 'Failed to update order', message: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/orders/[id]
 * Deletes an order (admin only)
 */
export async function DELETE(request, { params }) {
  try {
    console.log('=== [Admin Orders API] DELETE /[id] ===');
    console.log('[Admin Orders API] Request URL:', request.url);
    console.log('[Admin Orders API] Params.id:', params.id);
    console.log('[Admin Orders API] Full params object:', params);
    console.log('[Admin Orders API] Params keys:', Object.keys(params || {}));
    
    // Extract ID from URL if params is empty (Next.js App Router issue)
    let orderId = params?.id;
    if (!orderId && request.url) {
      const urlParts = request.url.split('/');
      orderId = urlParts[urlParts.length - 1]; // Get last part of URL
      console.log('[Admin Orders API] Extracted ID from URL:', orderId);
    }
    
    console.log('[Admin Orders API] Final orderId:', orderId);
    console.log('[Admin Orders API] OrderId type:', typeof orderId);
    console.log('[Admin Orders API] OrderId length:', orderId?.length);

    if (!orderId) {
      console.error('[Admin Orders API] No orderId found in params or URL');
      return Response.json(
        { error: 'Order ID not provided', orderId: orderId },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const Order = (await import('@/models/Order')).default;
    const mongoose = (await import('mongoose')).default;

    // Debug: List all orders before attempting deletion
    const allOrders = await Order.find({}).select('_id orderNumber status').lean();
    console.log('[Admin Orders API] All available orders:');
    allOrders.forEach((order, index) => {
      console.log(`  ${index + 1}. _id: ${order._id.toString()}, orderNumber: ${order.orderNumber}, status: ${order.status}`);
    });

    // Convert string ID to ObjectId using mongoose
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(orderId);
      console.log('[Admin Orders API] Created ObjectId:', objectId);
    } catch (error) {
      console.error('[Admin Orders API] Invalid ObjectId format:', orderId, error.message);
      // Try as orderNumber fallback
      objectId = null;
    }
    
    let deletedOrder = null;
    
    // Try by ObjectId first if valid
    if (objectId) {
      console.log('[Admin Orders API] Trying to delete by ObjectId:', objectId);
      deletedOrder = await Order.findByIdAndDelete(objectId);
    }
    
    // If not found by ObjectId, try by orderNumber
    if (!deletedOrder) {
      console.log('[Admin Orders API] Order not found by ObjectId, trying orderNumber:', orderId);
      deletedOrder = await Order.findOneAndDelete({ orderNumber: orderId });
    }
    
    if (!deletedOrder) {
      console.log('[Admin Orders API] Order not found by either ObjectId or orderNumber');
      console.log('[Admin Orders API] Debug info:');
      console.log('  - Target orderId:', orderId);
      console.log('  - ObjectId valid:', !!objectId);
      console.log('  - Available orders:', allOrders.length);
      
      return Response.json(
        { 
          error: 'Order not found', 
          orderId: orderId,
          debug: {
            targetOrderId: orderId,
            objectIdValid: !!objectId,
            availableOrders: allOrders.map(o => ({
              _id: o._id.toString(),
              orderNumber: o.orderNumber,
              status: o.status
            }))
          }
        },
        { status: 404 }
      );
    }

    console.log('[Admin Orders API] Order deleted successfully:', deletedOrder._id);
    
    // Broadcast the deletion to all connected clients
    try {
      const broadcastResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orders/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'order_removed',
          orderId: deletedOrder._id.toString(),
          orderNumber: deletedOrder.orderNumber,
          customerName: deletedOrder.customerName,
          timestamp: new Date().toISOString()
        })
      });
      
      if (broadcastResponse.ok) {
        console.log('[Admin Orders API] Deletion broadcasted successfully');
      } else {
        console.error('[Admin Orders API] Failed to broadcast deletion');
      }
    } catch (broadcastError) {
      console.error('[Admin Orders API] Broadcast error:', broadcastError);
    }
    
    return Response.json(
      { message: 'Order deleted successfully', orderId: orderId },
      { status: 200 }
    );

  } catch (error) {
    console.error('[Admin Orders API DELETE Error]:', error.message);
    console.error('[Admin Orders API DELETE Stack]:', error.stack);
    return Response.json(
      { error: 'Failed to delete order', message: error.message },
      { status: 500 }
    );
  }
}