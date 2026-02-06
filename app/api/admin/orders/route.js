import { connectToDatabase } from '@/lib/db';

/**
 * POST /api/orders
 * Creates an order from cart data
 * 
 * Bridge between:
 * - Client: localStorage cart (CartContext)
 * - Server: MongoDB orders collection
 */
export async function POST(request) {
  try {
    console.log('[Orders API] POST request received');
    
    // Get cart data from client
    const cartData = await request.json();
    console.log('[Orders API] Cart data received:', {
      itemCount: cartData.items?.length,
      total: cartData.total
    });

    // Validate cart is not empty
    if (!cartData.items || cartData.items.length === 0) {
      return Response.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();
    console.log('[Orders API] Database connected');

    // Import Order model
    let Order;
    try {
      Order = (await import('@/models/Order')).default;
      console.log('[Orders API] Order model imported');
    } catch (modelError) {
      console.error('[Orders API] Failed to import Order model:', modelError.message);
      return Response.json(
        { error: 'Order model not found', message: modelError.message },
        { status: 500 }
      );
    }

    // Calculate totals
    const subtotal = cartData.items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);

    const shipping = cartData.shipping || 0;
    const tax = cartData.tax || 0;
    const total = subtotal + shipping + tax;

    // Create order object
    const orderData = {
      items: cartData.items.map(item => ({
        productId: item.id,
        name: item.name || item.title,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity) || 1,
        image: item.image,
        category: item.category,
        brand: item.brand
      })),
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      status: 'pending',
      paymentStatus: 'pending',
      userEmail: cartData.userEmail || null,
      userPhone: cartData.userPhone || null,
      shippingAddress: cartData.shippingAddress || null,
      billingAddress: cartData.billingAddress || null,
      paymentMethod: cartData.paymentMethod || null,
      notes: cartData.notes || '',
      userId: cartData.userId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(),
          message: 'Order created from cart'
        }
      ]
    };

    // Save order to MongoDB
    const newOrder = await Order.create(orderData);
    console.log('[Orders API] Order created successfully:', newOrder._id);

    // Return success response
    return Response.json({
      success: true,
      message: 'Order created successfully',
      orderId: newOrder._id,
      orderNumber: newOrder._id.toString().slice(-8).toUpperCase(),
      order: {
        _id: newOrder._id,
        total: newOrder.total,
        status: newOrder.status,
        createdAt: newOrder.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[Orders API Error]:', error.message);
    return Response.json(
      { 
        success: false,
        error: 'Failed to create order', 
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * Get all orders (public endpoint)
 * For user-specific orders, consider adding authentication
 */
export async function GET(request) {
  try {
    console.log('[Orders API] GET request received');

    await connectToDatabase();
    const Order = (await import('@/models/Order')).default;

    // Fetch all orders, sorted by newest first
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(100);

    console.log('[Orders API] Found orders:', orders.length);

    return Response.json({
      success: true,
      count: orders.length,
      orders: orders
    }, { status: 200 });

  } catch (error) {
    console.error('[Orders API GET Error]:', error.message);
    return Response.json(
      { 
        success: false,
        error: 'Failed to fetch orders', 
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/orders/[id]
 * Delete an order by ID (handled in main route)
 */
export async function DELETE(request) {
  console.log('=== DELETE METHOD CALLED ===');
  
  // Simple test response
  return Response.json({
    message: 'DELETE method called successfully',
    timestamp: new Date().toISOString()
  });
  
  // Original DELETE logic (commented out for testing)
  /*
  try {
    console.log('[Orders API] DELETE request received (main route)');
    
    // Get the ID from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const orderId = pathParts[pathParts.length - 1];
    
    console.log('[Orders API] Extracted order ID:', orderId);
    
    if (!orderId) {
      return Response.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();
    const Order = (await import('@/models/Order')).default;
    const mongoose = (await import('mongoose')).default;

    // Convert to ObjectId and delete
    const objectId = new mongoose.Types.ObjectId(orderId);
    
    console.log('[Orders API] Converted to ObjectId:', objectId);
    
    const deletedOrder = await Order.findByIdAndDelete(objectId);
    
    if (!deletedOrder) {
      console.log('[Orders API] Order not found by ObjectId, trying orderNumber...');
      
      // Try by orderNumber as fallback
      const fallbackOrder = await Order.findOneAndDelete({ orderNumber: orderId });
      if (!fallbackOrder) {
        console.log('[Orders API] Order not found by orderNumber either');
        
        // Debug: list all orders
        const allOrders = await Order.find({}).select('_id orderNumber').lean();
        console.log('[Orders API] All orders in DB:', allOrders.map(o => ({
          _id: o._id.toString(),
          orderNumber: o.orderNumber
        })));
        
        return Response.json(
          { error: 'Order not found', orderId: orderId },
          { status: 404 }
        );
      }
      
      console.log('[Orders API] Order deleted by orderNumber:', fallbackOrder._id);
      return Response.json(
        { message: 'Order deleted successfully', orderId: orderId },
        { status: 200 }
      );
    }
    
    console.log('[Orders API] Order deleted successfully:', deletedOrder._id);
    
    return Response.json(
      { message: 'Order deleted successfully', orderId: orderId },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('[Orders API] DELETE Error:', error.message);
    return Response.json(
      { error: 'Failed to delete order', message: error.message },
      { status: 500 }
    );
  }
  */
}

/**
 * PATCH /api/admin/orders/[id]
 * Update order status
 */
export async function PATCH(request, { params }) {
  try {
    console.log('[Orders API] PATCH request received');
    
    const orderId = params.id;
    const body = await request.json();
    
    console.log('[Orders API] Updating order:', orderId, 'with status:', body.status);

    if (!orderId) {
      return Response.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();
    const Order = (await import('@/models/Order')).default;

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        status: body.status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedOrder) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('[Orders API] Order updated successfully:', orderId);
    
    return Response.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    }, { status: 200 });

  } catch (error) {
    console.error('[Orders API PATCH Error]:', error.message);
    return Response.json(
      { 
        success: false,
        error: 'Failed to update order', 
        message: error.message 
      },
      { status: 500 }
    );
  }
}