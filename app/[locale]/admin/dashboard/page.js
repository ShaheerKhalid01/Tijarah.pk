'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsRes = await fetch('/api/products');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          // Handle different response structures
          const productsArray = Array.isArray(productsData) ? productsData : productsData.products || [];
          setProducts(productsArray.slice(0, 10));
        }

        // Fetch users
        const usersRes = await fetch('/api/admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          // Handle different response structures
          const usersArray = Array.isArray(usersData) ? usersData : usersData.users || [];
          setUsers(usersArray.slice(0, 10));
          setStats(prev => ({ ...prev, totalUsers: usersArray.length }));
        }

        // Fetch orders with user information
        // Use the same source that checkout writes to: /api/orders
        const ordersRes = await fetch('/api/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          // Handle different response structures
          const ordersArray = Array.isArray(ordersData) ? ordersData : ordersData.orders || [];
          
          console.log('=== DEBUG: Raw Orders Data ===');
          console.log('Orders array length:', ordersArray.length);
          console.log('First order ID:', ordersArray[0]?._id);
          console.log('First order ID type:', typeof ordersArray[0]?._id);
          console.log('First order ID string:', ordersArray[0]?._id?.toString());
          
          // Process orders to include user information
          const processedOrders = ordersArray.map(order => ({
            ...order,
            userName: order.user?.name || 'Guest',
            userEmail: order.user?.email || 'guest@example.com',
            orderDate: new Date(order.createdAt).toLocaleDateString(),
            orderTime: new Date(order.createdAt).toLocaleTimeString(),
            formattedTotal: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(order.total || 0)
          }));

          console.log('=== DEBUG: Processed Orders ===');
          console.log('Processed orders:', processedOrders.map(o => ({ 
            _id: o._id, 
            _idType: typeof o._id,
            _idString: o._id?.toString(),
            status: o.status 
          })));

          setOrders(processedOrders.slice(0, 10));
          
          // Calculate statistics
          const totalRevenue = ordersArray.reduce((sum, order) => sum + (order.total || 0), 0);
          
          setStats(prev => ({
            ...prev,
            totalOrders: ordersArray.length,
            pendingOrders: ordersArray.filter(o => o.status === 'pending').length,
            totalRevenue: totalRevenue
          }));
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Test function to check if API is working
  const testOrderAPI = async (orderId) => {
    console.log('=== TESTING: Order API ===');
    console.log('Testing with ID:', orderId);
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      console.log('Test API Response Status:', response.status);
      
      const responseText = await response.text();
      console.log('Test API Response:', responseText);
      
      return responseText;
    } catch (error) {
      console.error('Test API Error:', error);
      return error.message;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    console.log('=== DEBUG: Status Change Attempt ===');
    console.log('Order ID:', orderId);
    console.log('New Status:', newStatus);
    console.log('Order ID Type:', typeof orderId);
    console.log('Order ID Length:', orderId?.length);
    
    // Convert ObjectId to string if needed (and handle possible nested _id objects)
    const rawId = orderId?._id || orderId;
    const orderIdString = rawId?.toString?.() || rawId;
    console.log('Converted Order ID:', orderIdString);
    console.log('Converted Order ID Type:', typeof orderIdString);
    
    try {
      const apiUrl = `/api/admin/orders/${orderIdString}`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          orderId: orderIdString,      // send explicit id
        })
      });
      
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);
      
      const responseText = await response.text();
      console.log('Response Text:', responseText);
      
      if (response.ok) {
        // Update order status in state (match by both _id and orderNumber as fallback)
        setOrders(prev => prev.map(order => {
          const orderOrderIdString = order._id?._id?.toString?.() || order._id?.toString?.() || order._id;
          const matchesId = orderOrderIdString === orderIdString;
          const matchesOrderNumber = order.orderNumber && order.orderNumber === orderIdString;
          return (matchesId || matchesOrderNumber)
            ? { ...order, status: newStatus }
            : order;
        }));

        // Update stats
        const updatedOrder = orders.find(o => {
          const orderOrderIdString = o._id?._id?.toString?.() || o._id?.toString?.() || o._id;
          const matchesId = orderOrderIdString === orderIdString;
          const matchesOrderNumber = o.orderNumber && o.orderNumber === orderIdString;
          return matchesId || matchesOrderNumber;
        });
        
        setStats(prev => ({
          ...prev,
          pendingOrders: prev.pendingOrders - (updatedOrder?.status === 'pending' ? 1 : 0) + (newStatus === 'pending' ? 1 : 0)
        }));
        
        alert(`Order status changed to '${newStatus}' successfully!`);
      } else {
        console.error('API Error Response:', responseText);
        alert(`Failed to update order status. Status: ${response.status}, Error: ${responseText}`);
      }
    } catch (error) {
      console.error('Network/Error:', error);
      alert(`Error updating order status: ${error.message}`);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This will change the status to cancelled.')) {
      await handleStatusChange(orderId, 'cancelled');
    }
  };

  const handleRemoveOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to permanently remove this order? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Remove order from state
          setOrders(prev => prev.filter(order => order._id !== orderId));
          
          // Update stats
          const removedOrder = orders.find(o => o._id === orderId);
          setStats(prev => ({
            ...prev,
            totalOrders: prev.totalOrders - 1,
            pendingOrders: prev.pendingOrders - (removedOrder?.status === 'pending' ? 1 : 0)
          }));
          
          alert('Order removed successfully!');
        } else {
          alert('Failed to remove order. Please try again.');
        }
      } catch (error) {
        console.error('Error removing order:', error);
        alert('Error removing order. Please check console for details.');
      }
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

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders, color: 'bg-green-500' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: 'bg-purple-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-yellow-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{session?.user?.name || session?.user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'products', label: 'Products' },
            { id: 'orders', label: 'Orders' },
            { id: 'users', label: 'Users' },
            { id: 'categories', label: 'Categories' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {statCards.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                      <div className="w-6 h-6 text-white"></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Order ID</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Customer</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Total</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-black font-medium">#{order._id?.slice(-6)}</td>
                          <td className="px-6 py-4 text-black">{order.customerName || 'N/A'}</td>
                          <td className="px-6 py-4 font-semibold text-black">${order.total?.toFixed(2) || '0'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-black">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-black text-center py-8">No orders yet</p>
              )}
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-black mb-4">Recent Products</h2>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                      {product.images && product.images[0] && (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-black truncate">{product.name}</h3>
                      <p className="text-sm text-black mt-1">SKU: {product.sku || 'N/A'}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-bold text-blue-600">${product.price?.toFixed(2) || '0'}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Stock: {product.stock || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-black text-center py-8">No products yet</p>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-black">Products ({products.length})</h2>
              <Link 
                href="/en/admin/products"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Manage Products
              </Link>
            </div>
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-black">Name</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">SKU</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Price</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Stock</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-black font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-black">{product.sku || 'N/A'}</td>
                        <td className="px-6 py-4 font-semibold text-blue-600">${product.price?.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.stock || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-black">{product.category || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-black text-center py-8">No products found</p>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-black">All Orders ({orders.length})</h2>
              <button
                onClick={() => {
                  if (orders.length > 0) {
                    testOrderAPI(orders[0]._id);
                  } else {
                    alert('No orders to test');
                  }
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
              >
                Test First Order API
              </button>
            </div>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-black">Order ID</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Customer</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Total</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Date</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-black font-medium">#{order._id?.slice(-6)}</td>
                        <td className="px-6 py-4 text-black">{order.customerName || 'N/A'}</td>
                        <td className="px-6 py-4 font-semibold text-black">${order.total?.toFixed(2) || '0'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-black">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 items-center">
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => {
                                console.log('=== DEBUG: Dropdown Change ===');
                                console.log('Order object:', order);
                                console.log('Order._id:', order._id);
                                console.log('Order._id type:', typeof order._id);
                                console.log('Order._id toString():', order._id?.toString?.());
                                handleStatusChange(order._id, e.target.value);
                              }}
                              className="text-xs text-black border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => handleRemoveOrder(order._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-black text-center py-8">No orders found</p>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-black">Users ({users.length})</h2>
            </div>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-black">Name</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Email</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Role</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Verified</th>
                      <th className="px-6 py-3 text-left font-semibold text-black">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-black font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-black">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={user.isVerified ? 'text-green-600' : 'text-red-600'}>
                            {user.isVerified ? '✓ Yes' : '✗ No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-black">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No users found</p>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Categories Management</h2>
              <Link 
                href="/en/admin/categories"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Manage Categories
              </Link>
            </div>
            <p className="text-gray-600 text-center py-8">Go to Categories page to manage categories</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
            <div className="space-y-6">
              {/* General Settings */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input 
                      type="text" 
                      defaultValue="Tijarah.pk"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                    <input 
                      type="email" 
                      defaultValue="support@tijarah.pk"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="border-t pt-6 flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}