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
  console.log('Params.id:', params.id);

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

    const idFromParams = params.id;
    const idFromBody = body.orderId;

    const candidateIds = Array.from(
      new Set(
        [idFromParams, idFromBody]
          .filter(Boolean)
          .map(v => (typeof v === 'string' ? v.trim() : String(v)))
      )
    );

    console.log('[Admin Orders API] Candidate IDs:', candidateIds);

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
          { new: true }
        ).populate('user', 'name email');

        if (order) {
          console.log('[Admin Orders API] Updated by _id:', candidate);
          break;
        }
      } catch (e) {
        // ignore cast errors and try next candidate
        console.warn('[Admin Orders API] _id update failed for candidate:', candidate, e.message);
      }
    }

    // 2) If still not found, try each candidate as orderNumber
    if (!order) {
      for (const candidate of candidateIds) {
        order = await Order.findOneAndUpdate(
          { orderNumber: candidate },
          {
            ...body,
            updatedAt: new Date(),
          },
          { new: true }
        ).populate('user', 'name email');

        if (order) {
          console.log('[Admin Orders API] Updated by orderNumber:', candidate);
          break;
        }
      }
    }

    if (!order) {
      const allOrders = await Order.find({}).select('_id orderNumber status').lean();
      console.log('[Admin Orders API] No matching order for any candidate ID');

      return Response.json(
        {
          error: 'Order not found',
          orderId: params.id,
          candidatesTried: candidateIds,
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

    console.log('[Admin Orders API] Order updated successfully:', order._id);
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
    console.log('[Admin Orders API] DELETE request received for order:', params.id);

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

    // Try delete by _id first, then by orderNumber as fallback
    let order = null;
    try {
      order = await Order.findByIdAndDelete(params.id);
    } catch (e) {
      console.warn('[Admin Orders API] _id delete failed:', e.message);
    }

    if (!order) {
      order = await Order.findOneAndDelete({ orderNumber: params.id });
    }

    if (!order) {
      console.log('[Admin Orders API] Order not found:', params.id);
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('[Admin Orders API] Order deleted successfully:', order._id);
    return Response.json(
      { message: 'Order deleted successfully', orderId: params.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Admin Orders API DELETE Error]:', error.message);
    return Response.json(
      { error: 'Failed to delete order', message: error.message },
      { status: 500 }
    );
  }
}
