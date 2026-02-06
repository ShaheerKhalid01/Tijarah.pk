import { connectToDatabase } from '@/lib/db';

/**
 * POST /api/returns
 * Create a return request for an order
 */
export async function POST(request) {
  try {
    console.log('=== [RETURNS API] Request received ===');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('[RETURNS API] Body parsed successfully');
      console.log('[RETURNS API] Body keys:', Object.keys(body));
    } catch (parseError) {
      console.error('[RETURNS API] Failed to parse body:', parseError.message);
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    console.log('[RETURNS API] Validating required fields...');
    if (!body.orderId) {
      console.error('[RETURNS API] Missing orderId');
      return Response.json({ error: 'Missing orderId' }, { status: 400 });
    }
    if (!body.customerEmail) {
      console.error('[RETURNS API] Missing customerEmail');
      return Response.json({ error: 'Missing customerEmail' }, { status: 400 });
    }
    if (!body.reason) {
      console.error('[RETURNS API] Missing reason');
      return Response.json({ error: 'Missing return reason' }, { status: 400 });
    }
    console.log('[RETURNS API] All required fields present');

    // Connect to database
    console.log('[RETURNS API] Connecting to database...');
    try {
      await connectToDatabase();
      console.log('[RETURNS API] Database connected');
    } catch (dbError) {
      console.error('[RETURNS API] Database connection error:', dbError.message);
      return Response.json(
        { error: 'Database connection failed', message: dbError.message },
        { status: 500 }
      );
    }

    // Import models
    console.log('[RETURNS API] Importing models...');
    let Order, Return;
    try {
      Order = (await import('@/models/Order')).default;
      Return = (await import('@/models/Return')).default;
      console.log('[RETURNS API] Models imported successfully');
    } catch (modelError) {
      console.error('[RETURNS API] Failed to import models:', modelError.message);
      return Response.json(
        { error: 'Models not found', message: modelError.message },
        { status: 500 }
      );
    }

    // Verify order exists and belongs to customer
    console.log('[RETURNS API] Verifying order...');
    const order = await Order.findOne({ 
      _id: body.orderId,
      customerEmail: body.customerEmail 
    });

    if (!order) {
      console.error('[RETURNS API] Order not found or unauthorized');
      return Response.json(
        { error: 'Order not found or unauthorized' },
        { status: 404 }
      );
    }

    // Generate return number
    const returnNumber = `RET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log('[RETURNS API] Generated return number:', returnNumber);

    // Create return object
    console.log('[RETURNS API] Creating return object...');
    const returnObj = {
      returnNumber,
      orderId: order._id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || '',
      items: body.items || order.items, // Return all items or specified items
      reason: body.reason,
      description: body.description || '',
      refundAmount: body.refundAmount || order.total,
      refundMethod: body.refundMethod || 'original',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('[RETURNS API] Return object created');

    // Create and save return
    console.log('[RETURNS API] Saving return to database...');
    try {
      const returnRequest = new Return(returnObj);
      await returnRequest.save();
      console.log('[RETURNS API] Return saved successfully');
      console.log('[RETURNS API] Return ID:', returnRequest._id);

      // Update order status to indicate return initiated
      await Order.findByIdAndUpdate(order._id, {
        status: 'return_requested',
        updatedAt: new Date(),
        $push: {
          statusHistory: {
            status: 'return_requested',
            timestamp: new Date(),
            message: `Return request ${returnNumber} initiated`
          }
        }
      });

      return Response.json(
        {
          success: true,
          message: 'Return request created successfully',
          return: {
            id: returnRequest._id,
            returnNumber: returnRequest.returnNumber,
            status: returnRequest.status,
          },
        },
        { status: 201 }
      );
    } catch (saveError) {
      console.error('[RETURNS API] Failed to save return:', saveError.message);
      console.error('[RETURNS API] Error details:', saveError);
      return Response.json(
        { error: 'Failed to save return request', message: saveError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('=== [RETURNS API] UNEXPECTED ERROR ===');
    console.error('[RETURNS API] Error message:', error.message);
    console.error('[RETURNS API] Error stack:', error.stack);
    
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
 * GET /api/returns?email=email@example.com
 * Get returns by customer email
 */
export async function GET(request) {
  try {
    console.log('[RETURNS API] GET request received');
    
    await connectToDatabase();
    const Return = (await import('@/models/Return')).default;

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let query = {};
    if (email) {
      query.customerEmail = email;
    }

    const returns = await Return.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    console.log('[RETURNS API] Found returns:', returns.length);
    return Response.json(returns, { status: 200 });
  } catch (error) {
    console.error('[RETURNS API] GET error:', error);
    return Response.json(
      { error: 'Failed to fetch returns', message: error.message },
      { status: 500 }
    );
  }
}
