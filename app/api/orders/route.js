import { connectToDatabase } from '@/lib/db';

/**
 * POST /api/orders
 * Create a new order from checkout
 */
export async function POST(request) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.customerName) {
      return Response.json({ error: 'Missing customerName' }, { status: 400 });
    }
    if (!body.customerEmail) {
      return Response.json({ error: 'Missing customerEmail' }, { status: 400 });
    }
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return Response.json({ error: 'Missing items array' }, { status: 400 });
    }

    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbError) {
      return Response.json(
        { error: 'Database connection failed', message: dbError.message },
        { status: 500 }
      );
    }

    // Import Order model
    let Order;
    try {
      Order = (await import('@/models/Order')).default;
    } catch (modelError) {
      return Response.json(
        { error: 'Order model not found', message: modelError.message },
        { status: 500 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create order object
    const orderObj = {
      orderNumber,
      user: body.userId || null,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone || '',
      shippingAddress: body.shippingAddress || {},
      items: body.items,
      subtotal: body.subtotal || 0,
      shippingCost: body.shippingCost || 0,
      tax: body.tax || 0,
      total: body.total || 0,
      paymentMethod: body.paymentMethod || 'cash_on_delivery',
      paymentStatus: body.paymentStatus || 'pending',
      status: 'pending',
      notes: body.notes || '',
    };

    // Create and save order
    try {
      const order = new Order(orderObj);
      await order.save();

      return Response.json(
        {
          success: true,
          message: 'Order created successfully',
          order: {
            id: order._id,
            orderNumber: order.orderNumber,
            total: order.total,
          },
        },
        { status: 201 }
      );
    } catch (saveError) {
      return Response.json(
        { error: 'Failed to save order', message: saveError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    return Response.json(
      { 
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders?email=email@example.com
 * Get orders by customer email
 */
export async function GET(request) {
  try {
    await connectToDatabase();
    const Order = (await import('@/models/Order')).default;

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = {};
    if (email) {
      query.customerEmail = email;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return Response.json(orders, { status: 200 });
  } catch (error) {
    console.error('[ORDERS API] GET error:', error);
    return Response.json(
      { error: 'Failed to fetch orders', message: error.message },
      { status: 500 }
    );
  }
}