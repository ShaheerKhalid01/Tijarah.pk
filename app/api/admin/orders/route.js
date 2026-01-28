import { connectToDatabase } from '@/lib/db';

/**
 * GET /api/admin/orders
 * Returns all orders (admin only)
 *
 * NOTE:
 * - PATCH and DELETE for a specific order are handled by the dynamic route:
 *   /api/admin/orders/[id] (see app/api/admin/orders/[id]/route.js)
 */
export async function GET(request) {
  try {
    console.log('[Admin Orders API] GET request received');
    
    await connectToDatabase();
    console.log('[Admin Orders API] Database connected');

    // Import Order model
    let Order;
    try {
      Order = (await import('@/models/Order')).default;
      console.log('[Admin Orders API] Order model imported');
    } catch (modelError) {
      console.error('[Admin Orders API] Failed to import Order model:', modelError.message);
      return Response.json(
        { error: 'Order model not found', message: modelError.message },
        { status: 500 }
      );
    }

    // Get all orders
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    console.log('[Admin Orders API] Found orders:', orders.length);

    return Response.json(orders, { status: 200 });

  } catch (error) {
    console.error('[Admin Orders API Error]:', error.message);
    return Response.json(
      { error: 'Failed to fetch orders', message: error.message },
      { status: 500 }
    );
  }
}