'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiShoppingBag, FiHeart, FiSettings, FiEdit2, FiCalendar, FiPackage } from 'react-icons/fi';

const ProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const { data: session, status } = useSession();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    preferences: {
      newsletter: true,
      notifications: true,
      theme: 'light'
    }
  });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
      return;
    }

    if (status === 'authenticated') {
      // Debug: Log session data
      console.log('Session data:', session);
      console.log('User role:', session.user?.role);
      
      // Load profile data
      setProfileData(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || ''
      }));
      
      // Load user orders
      fetchUserOrders();
    }
  }, [status, session, router, locale]);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/orders/user');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefName = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefName]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would typically save to your API
      console.log('Saving profile:', profileData);
      
      // Show success message (you could use a toast library)
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'processing': { text: 'Processing', color: 'bg-blue-100 text-blue-800' },
      'shipped': { text: 'Shipped', color: 'bg-purple-100 text-purple-800' },
      'delivered': { text: 'Delivered', color: 'bg-green-100 text-green-800' },
      'cancelled': { text: 'Cancelled', color: 'bg-red-100 text-red-800' }
    };
    
    const statusInfo = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
                <p className="text-gray-500">{profileData.email}</p>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="preferences.newsletter"
                        checked={profileData.preferences.newsletter}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Subscribe to newsletter</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="preferences.notifications"
                        checked={profileData.preferences.notifications}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Email notifications</span>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiMail className="w-5 h-5" />
                    <span>{profileData.email}</span>
                  </div>
                  
                  {profileData.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <FiPhone className="w-5 h-5" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                  
                  {profileData.address && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <FiMapPin className="w-5 h-5" />
                      <span>{profileData.address}</span>
                    </div>
                  )}
                  
                  {profileData.bio && (
                    <div className="text-gray-600">
                      <p>{profileData.bio}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Preferences</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Newsletter: {profileData.preferences.newsletter ? 'Subscribed' : 'Not subscribed'}</p>
                      <p>Notifications: {profileData.preferences.notifications ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6 mt-6">
              <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href={`/${locale}/returns-orders`}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiPackage className="w-5 h-5" />
                  <span>View Orders</span>
                </Link>
                
                <Link
                  href={`/${locale}/cart`}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiShoppingBag className="w-5 h-5" />
                  <span>Shopping Cart</span>
                </Link>
                
                <Link
                  href={`/${locale}/wishlist`}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiHeart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>
                
                <Link
                  href={`/${locale}/settings`}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiSettings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Orders</h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id || order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">Order #{order.orderNumber}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt || order.date).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <span key={index}>
                            {item.productName}
                            {index < Math.min(order.items.length - 1, 1) && ', '}
                          </span>
                        ))}
                        {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          ${order.total ? (order.total * 0.0036).toFixed(2) : '0.00'}
                        </span>
                        <Link
                          href={`/${locale}/returns-orders`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                  
                  {orders.length > 5 && (
                    <div className="text-center pt-4">
                      <Link
                        href={`/${locale}/returns-orders`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View All Orders ({orders.length})
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                  <Link
                    href={`/${locale}/categories/electronics`}
                    className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
