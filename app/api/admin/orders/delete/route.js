import { connectToDatabase } from '@/lib/db';

export async function POST(request) {
  try {
    console.log('=== DELETE ENDPOINT CALLED ===');
    
    // Get the order ID from the request body
    const body = await request.json();
    const { orderId } = body;
    
    console.log('Order ID to delete:', orderId);
    
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
    
    console.log('Converted to ObjectId:', objectId);
    
    const deletedOrder = await Order.findByIdAndDelete(objectId);
    
    if (!deletedOrder) {
      console.log('Order not found by ObjectId, trying orderNumber...');
      
      // Try by orderNumber as fallback
      const fallbackOrder = await Order.findOneAndDelete({ orderNumber: orderId });
      if (!fallbackOrder) {
        console.log('Order not found by orderNumber either');
        
        // Debug: list all orders
        const allOrders = await Order.find({}).select('_id orderNumber').lean();
        console.log('All orders in DB:', allOrders.map(o => ({
          _id: o._id.toString(),
          orderNumber: o.orderNumber
        })));
        
        return Response.json(
          { error: 'Order not found', orderId: orderId },
          { status: 404 }
        );
      }
      
      console.log('Order deleted by orderNumber:', fallbackOrder._id);
      return Response.json(
        { message: 'Order deleted successfully', orderId: orderId },
        { status: 200 }
      );
    }
    
    console.log('Order deleted successfully:', deletedOrder._id);
    
    return Response.json(
      { message: 'Order deleted successfully', orderId: orderId },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('DELETE Error:', error.message);
    return Response.json(
      { error: 'Failed to delete order', message: error.message },
      { status: 500 }
    );
  }
}
