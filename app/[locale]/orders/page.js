'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useOrderUpdates } from '../../../hooks/useOrderUpdates';

export default function OrdersPage() {
  const params = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Real-time updates handler
  const handleOrderUpdate = (update) => {
    // Only process updates if they belong to the current user
    const isUserOrder = orders.some(order => {
      const orderIdString = order._id?.toString?.() || order._id;
      const matchesId = orderIdString === update.orderId;
      const matchesOrderNumber = order.orderNumber === update.orderNumber;
      const matchesEmail = order.customerEmail === session?.user?.email;

      return (matchesId || matchesOrderNumber) && matchesEmail;
    });

    if (!isUserOrder) {
      return;
    }

    // Update the specific order in the list
    if (update.type === 'order_status_changed') {
      setOrders(prev => {
        const updatedOrders = prev.map(order => {
          const orderIdString = order._id?.toString?.() || order._id;
          const matchesId = orderIdString === update.orderId;
          const matchesOrderNumber = order.orderNumber === update.orderNumber;

          if (matchesId || matchesOrderNumber) {
            return { ...order, status: update.newStatus };
          }
          return order;
        });
        return updatedOrders;
      });
    } else if (update.type === 'order_removed') {
      setOrders(prev => {
        const filteredOrders = prev.filter(order => {
          const orderIdString = order._id?.toString?.() || order._id;
          const matchesId = orderIdString === update.orderId;
          const matchesOrderNumber = order.orderNumber === update.orderNumber;
          const matchesEmail = order.customerEmail === session?.user?.email;

          return !((matchesId || matchesOrderNumber) && matchesEmail);
        });
        return filteredOrders;
      });
    }
  };

  // Listen for real-time updates
  const { isConnected, useFallback } = useOrderUpdates((update) => {
    handleOrderUpdate(update);
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      const currentLocale = params?.locale || 'en';
      router.push(`/${currentLocale}/login`);
      return;
    }

    if (status === 'authenticated') {
      fetchUserOrders();
    }
  }, [status, router, params?.locale]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      console.log('[OrdersPage] Fetching orders for user:', session?.user?.email);
      console.log('[OrdersPage] Session status:', status);

      const response = await fetch('/api/orders/user');

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log('[OrdersPage] Fetched orders:', data.orders?.length || 0);
      console.log('[OrdersPage] First order:', data.orders?.[0]);

      setOrders(data.orders || []);
    } catch (err) {
      console.error('[OrdersPage] Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Order received - awaiting processing';
      case 'processing':
        return 'Order is being prepared';
      case 'shipped':
        return 'Order is on the way';
      case 'delivered':
        return 'Order has been delivered';
      case 'cancelled':
        return 'Order has been cancelled';
      default:
        return 'Status unknown';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserOrders}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <button
              onClick={() => router.push(`/${params?.locale || 'en'}`)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber?.slice(-6) || order._id?.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        ${order.total?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Status</h4>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-3 ${order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                            }`}></div>
                          <span className="text-sm text-gray-600">Order Placed</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className={`w-4 h-4 rounded-full mr-3 ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                            }`}></div>
                          <span className="text-sm text-gray-600">Processing</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className={`w-4 h-4 rounded-full mr-3 ${order.status === 'shipped' || order.status === 'delivered'
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                            }`}></div>
                          <span className="text-sm text-gray-600">Shipped</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className={`w-4 h-4 rounded-full mr-3 ${order.status === 'delivered'
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                            }`}></div>
                          <span className="text-sm text-gray-600">Delivered</span>
                        </div>
                      </div>
                      <div className="ml-8">
                        <p className="text-sm text-gray-600 font-medium">{getStatusText(order.status)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Shipping Address</h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingAddress?.fullName || order.customerName}</p>
                      <p>{order.shippingAddress?.address}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                      <p>{order.shippingAddress?.postalCode}</p>
                      <p>{order.shippingAddress?.country}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                          <div className="flex items-center">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded mr-4"
                              />
                            )}
                            <div>
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
