import { connectToDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(request) {
  try {
    // Get the user session
    const session = await getServerSession();
    
    if (!session) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[User Orders] Session user:', session.user);
    console.log('[User Orders] User email:', session.user.email);
    console.log('[User Orders] User ID:', session.user.id);

    // Connect to database
    await connectToDatabase();
    const Order = (await import('@/models/Order')).default;

    // Find orders for this user (try multiple email fields)
    const userEmail = session.user.email;
    const userId = session.user.id;

    console.log('[User Orders] Searching for orders with email:', userEmail);

    // First try to find all orders to see what's available
    const allOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    console.log('[User Orders] All recent orders:', allOrders.length);
    console.log('[User Orders] Sample order fields:', allOrders[0] ? Object.keys(allOrders[0]) : 'No orders');

    // Try multiple field combinations
    const orders = await Order.find({
      $or: [
        { customerEmail: userEmail },
        { customer_email: userEmail },
        { email: userEmail },
        { userEmail: userEmail },
        { user: userId },
        { userId: userId },
        { 'customer.email': userEmail }
      ]
    })
    .sort({ createdAt: -1 }) // newest first
    .lean();

    console.log(`[User Orders] Found ${orders.length} orders for user: ${userEmail}`);
    console.log('[User Orders] Found orders:', orders.map(o => ({
      id: o._id,
      orderNumber: o.orderNumber,
      customerEmail: o.customerEmail,
      email: o.email,
      customer_email: o.customer_email
    })));

    // If no orders found, try a broader search
    if (orders.length === 0) {
      console.log('[User Orders] No orders found, trying broader search...');
      
      // Try to find orders that contain the email anywhere
      const broaderOrders = await Order.find({
        $or: [
          { customerEmail: { $regex: userEmail, $options: 'i' } },
          { email: { $regex: userEmail, $options: 'i' } },
          { customer_email: { $regex: userEmail, $options: 'i' } }
        ]
      })
      .sort({ createdAt: -1 })
      .lean();

      console.log(`[User Orders] Broader search found ${broaderOrders.length} orders`);

      // If still no orders, return all recent orders for debugging
      if (broaderOrders.length === 0) {
        console.log('[User Orders] No orders found in broader search, returning recent orders for debugging');
        return Response.json({
          success: true,
          orders: allOrders.slice(0, 3), // Return first 3 orders for debugging
          count: allOrders.slice(0, 3).length,
          debug: {
            userEmail: userEmail,
            userId: userId,
            availableOrders: allOrders.length,
            message: 'No user-specific orders found, returning recent orders for debugging'
          }
        });
      }

      return Response.json({
        success: true,
        orders: broaderOrders,
        count: broaderOrders.length
      });
    }

    return Response.json({
      success: true,
      orders: orders,
      count: orders.length
    });

  } catch (error) {
    console.error('[User Orders] Error:', error);
    return Response.json(
      { error: 'Failed to fetch orders', message: error.message },
      { status: 500 }
    );
  }
}
