import { connectToDatabase } from '@/lib/db';

/**
 * POST /api/orders
 * Create a new order from checkout
 */
export async function POST(request) {
  try {
    console.log('=== [ORDERS API] Request received ===');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('[ORDERS API] Body parsed successfully');
      console.log('[ORDERS API] Body keys:', Object.keys(body));
    } catch (parseError) {
      console.error('[ORDERS API] Failed to parse body:', parseError.message);
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    console.log('[ORDERS API] Validating required fields...');
    if (!body.customerName) {
      console.error('[ORDERS API] Missing customerName');
      return Response.json({ error: 'Missing customerName' }, { status: 400 });
    }
    if (!body.customerEmail) {
      console.error('[ORDERS API] Missing customerEmail');
      return Response.json({ error: 'Missing customerEmail' }, { status: 400 });
    }
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      console.error('[ORDERS API] Missing or invalid items');
      return Response.json({ error: 'Missing items array' }, { status: 400 });
    }
    console.log('[ORDERS API] All required fields present');

    // Connect to database
    console.log('[ORDERS API] Connecting to database...');
    try {
      await connectToDatabase();
      console.log('[ORDERS API] Database connected');
    } catch (dbError) {
      console.error('[ORDERS API] Database connection error:', dbError.message);
      return Response.json(
        { error: 'Database connection failed', message: dbError.message },
        { status: 500 }
      );
    }

    // Import Order model
    console.log('[ORDERS API] Importing Order model...');
    let Order;
    try {
      Order = (await import('@/models/Order')).default;
      console.log('[ORDERS API] Order model imported successfully');
    } catch (modelError) {
      console.error('[ORDERS API] Failed to import Order model:', modelError.message);
      return Response.json(
        { error: 'Order model not found', message: modelError.message },
        { status: 500 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log('[ORDERS API] Generated order number:', orderNumber);

    // Create order object
    console.log('[ORDERS API] Creating order object...');
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
    console.log('[ORDERS API] Order object created');

    // Create and save order
    console.log('[ORDERS API] Saving order to database...');
    try {
      const order = new Order(orderObj);
      await order.save();
      console.log('[ORDERS API] Order saved successfully');
      console.log('[ORDERS API] Order ID:', order._id);

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
      console.error('[ORDERS API] Failed to save order:', saveError.message);
      console.error('[ORDERS API] Error details:', saveError);
      return Response.json(
        { error: 'Failed to save order', message: saveError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('=== [ORDERS API] UNEXPECTED ERROR ===');
    console.error('[ORDERS API] Error message:', error.message);
    console.error('[ORDERS API] Error stack:', error.stack);
    
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
    console.log('[ORDERS API] GET request received');
    
    await connectToDatabase();
    const Order = (await import('@/models/Order')).default;

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let query = {};
    if (email) {
      query.customerEmail = email;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    console.log('[ORDERS API] Found orders:', orders.length);
    return Response.json(orders, { status: 200 });
  } catch (error) {
    console.error('[ORDERS API] GET error:', error);
    return Response.json(
      { error: 'Failed to fetch orders', message: error.message },
      { status: 500 }
    );
  }
}