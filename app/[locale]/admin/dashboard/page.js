'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { electronicsProducts, hotDeals, newArrivals, specialOffers, mockDeals } from '@/app/lib/product-data';
import { useOrderUpdates } from '../../../../hooks/useOrderUpdates';

// ✅ OPTIMIZED: Move constants outside component
const CURRENCY_RATES = { PKR_TO_USD: 0.0036 };

const STATUS_COLORS = {
  'delivered': 'bg-green-100 text-green-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'shipped': 'bg-blue-100 text-blue-800',
  'processing': 'bg-purple-100 text-purple-800',
  'cancelled': 'bg-red-100 text-red-800',
};

const TAB_CONFIG = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'products', label: 'Products' },
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'special-offers', label: 'Special Offers' },
  { id: 'good-deals', label: 'Good Deals' },
  { id: 'todays-deals', label: "Today's Deals" },
  { id: 'users', label: 'Users' },
  { id: 'chats', label: 'AI Chats' },
];

// ✅ OPTIMIZED: Memoized formatters
const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format((amount || 0) * CURRENCY_RATES.PKR_TO_USD);
};

// ✅ OPTIMIZED: Extract Toast component
const Toast = memo(({ show, message, type, onClose }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 ${type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
      <div className="flex items-center">
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          {type === 'success' ? (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {type === 'success' ? 'Success' : 'Error'}
          </p>
          <p className={`text-sm ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {message}
          </p>
        </div>
        <button onClick={onClose} className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${type === 'success' ? 'text-green-500 hover:bg-green-100' : 'text-red-500 hover:bg-red-100'}`} type="button">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
});

Toast.displayName = 'Toast';

// ✅ OPTIMIZED: Extract StatCard component
const StatCard = memo(({ label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`${color} rounded-lg p-3 mr-4`}>
        <div className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

// ✅ OPTIMIZED: Extract TabButton component
const TabButton = memo(({ tab, activeTab, onClick }) => (
  <button onClick={() => onClick(tab.id)} className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
    {tab.label}
  </button>
));

TabButton.displayName = 'TabButton';

// ✅ OPTIMIZED: Extract LoadingSpinner component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// ✅ OPTIMIZED: Extract OrderTable component
const OrderTable = memo(({ orders, onStatusChange, onRemove }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-3 text-left font-semibold text-black">Order ID</th>
          <th className="px-6 py-3 text-left font-semibold text-black">Customer</th>
          <th className="px-6 py-3 text-left font-semibold text-black">Amount (USD)</th>
          <th className="px-6 py-3 text-left font-semibold text-black">Status</th>
          <th className="px-6 py-3 text-left font-semibold text-black">Date</th>
          {onStatusChange && <th className="px-6 py-3 text-left font-semibold text-black">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order._id} className="border-b hover:bg-gray-50">
            <td className="px-6 py-4 text-black font-medium">#{order._id?.slice(-6)}</td>
            <td className="px-6 py-4 text-black">{order.customerName || 'N/A'}</td>
            <td className="px-6 py-4 font-semibold text-black">{formatUSD(order.total)}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status?.toLowerCase()] || STATUS_COLORS['pending']}`}>
                {order.status || 'pending'}
              </span>
            </td>
            <td className="px-6 py-4 text-black">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
            </td>
            {onStatusChange && (
              <td className="px-6 py-4">
                <div className="flex gap-2 items-center">
                  <select value={order.status || 'pending'} onChange={(e) => onStatusChange(order._id, e.target.value)} className="text-xs text-black border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={() => onRemove(order._id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors" type="button">
                    Remove
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

OrderTable.displayName = 'OrderTable';

// ✅ OPTIMIZED: Extract ProductTable component
const ProductTable = memo(({ products, type }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-3 text-left font-semibold text-black">Name</th>
          <th className="px-6 py-3 text-left font-semibold text-black">SKU</th>
          <th className="px-6 py-3 text-left font-semibold text-black">Price (USD)</th>
          <th className="px-6 py-3 text-left font-semibold text-black">Stock</th>
          <th className="px-6 py-3 text-left font-semibold text-black">Category</th>
          <th className="px-6 py-3 text-left font-semibold text-black">Brand</th>
          <th className="px-6 py-3 text-left font-semibold text-black">Rating</th>
          <th className="px-6 py-3 text-left font-semibold text-black">Type</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id} className="border-b hover:bg-gray-50">
            <td className="px-6 py-4 text-black font-medium">
              <div className="flex items-center gap-2">
                {product.name}
                <div className="flex gap-1 flex-wrap">
                  {product.isNew && <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">New</span>}
                  {product.isHot && <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">Hot</span>}
                  {!product.inStock && <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">Out of Stock</span>}
                  {product.discount && <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">-{product.discount}%</span>}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-black">{product.sku || 'N/A'}</td>
            <td className="px-6 py-4 text-black">
              <div className="text-right">
                <div className="font-semibold text-blue-600">{formatUSD(product.price)}</div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-sm text-gray-500 line-through">{formatUSD(product.originalPrice)}</div>
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock || 0}
              </span>
            </td>
            <td className="px-6 py-4 text-black">{product.category?.name || 'N/A'}</td>
            <td className="px-6 py-4 text-black">{product.brand || 'N/A'}</td>
            <td className="px-6 py-4">
              {product.rating ? (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-gray-600">{product.rating}</span>
                  {product.reviewCount && <span className="text-gray-500 text-xs">({product.reviewCount})</span>}
                </div>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${type === 'Special Offer' ? 'bg-orange-100 text-orange-800' : type === 'New Arrival' ? 'bg-purple-100 text-purple-800' : type === "Today's Deal" ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'}`}>
                {type}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

ProductTable.displayName = 'ProductTable';

// ✅ OPTIMIZED: Extract UsersTable component
const UsersTable = memo(({ users }) => (
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
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
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
));

UsersTable.displayName = 'UsersTable';

// ✅ NEW: ChatList Component
const ChatList = memo(({ chats, onSelectChat, selectedChatId }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden h-[600px] flex flex-col">
    <div className="p-4 border-b bg-gray-50">
      <h3 className="font-semibold text-gray-700">Conversations</h3>
    </div>
    <div className="flex-1 overflow-y-auto">
      {chats.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No chats found</div>
      ) : (
        chats.map(chat => (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedChatId === chat._id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-gray-900 truncate w-24" title={chat.sessionId}>
                {chat.sessionId.substring(0, 8)}...
              </span>
              <span className="text-xs text-gray-500">
                {new Date(chat.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">
              {chat.messages[chat.messages.length - 1]?.content || 'No messages'}
            </p>
          </div>
        ))
      )}
    </div>
  </div>
));
ChatList.displayName = 'ChatList';

// ✅ NEW: ChatDetail Component
const ChatDetail = memo(({ chat }) => {
  if (!chat) return (
    <div className="bg-white rounded-lg shadow h-[600px] flex items-center justify-center text-gray-400">
      <div className="text-center">
        <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p>Select a conversation to view details</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-800">Session ID: {chat.sessionId}</h3>
          <p className="text-xs text-gray-500">Started: {new Date(chat.createdAt).toLocaleString()}</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {chat.messages.length} messages
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {chat.messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg px-4 py-3 text-sm shadow-sm ${msg.role === 'user'
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
              }`}>
              <p className="font-medium text-[10px] opacity-75 mb-1 uppercase tracking-wider">
                {msg.role}
              </p>
              {msg.content}
              <p className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
ChatDetail.displayName = 'ChatDetail';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const { locale } = useParams();
  const t = useTranslations('admin');
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newArrivalsState, setNewArrivalsState] = useState([]);
  const [goodDealsState, setGoodDealsState] = useState([]);
  const [todaysDealsState, setTodaysDealsState] = useState([]);
  const [specialOffersState, setSpecialOffersState] = useState([]);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // ✅ OPTIMIZED: Memoized order update handler
  const handleOrderUpdate = useCallback((update) => {
    if (update.type === 'order_updated' || update.type === 'order_status_changed') {
      setOrders(prev => {
        const updatedOrders = prev.map(order => {
          const orderIdString = order._id?.toString?.() || order._id;
          const updateIdString = update.data?._id?.toString?.() || update.data?._id || update.orderId;
          if (orderIdString === updateIdString || order.orderNumber === update.data?.orderNumber) {
            return update.data || { ...order, status: update.newStatus };
          }
          return order;
        });

        const totalRevenue = updatedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        setStats(prev => ({
          ...prev,
          totalOrders: updatedOrders.length,
          pendingOrders: updatedOrders.filter(o => o.status === 'pending').length,
          totalRevenue
        }));

        return updatedOrders;
      });
    } else if (update.type === 'order_removed') {
      setOrders(prev => {
        const filtered = prev.filter(order => {
          const orderIdString = order._id?.toString?.() || order._id;
          return !(orderIdString === update.orderId || order.orderNumber === update.orderNumber);
        });

        const totalRevenue = filtered.reduce((sum, order) => sum + (order.total || 0), 0);
        setStats(prev => ({
          ...prev,
          totalOrders: filtered.length,
          pendingOrders: filtered.filter(o => o.status === 'pending').length,
          totalRevenue
        }));

        return filtered;
      });
    }
  }, []);

  useOrderUpdates(handleOrderUpdate);

  // ✅ OPTIMIZED: Fast initial load - only fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders?limit=10');
        if (res.ok) {
          const data = await res.json();
          const ordersArray = Array.isArray(data) ? data : data.orders || [];
          ordersArray.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

          setOrders(ordersArray);
          const totalRevenue = ordersArray.reduce((sum, order) => sum + (order.total || 0), 0);
          setStats(prev => ({
            ...prev,
            totalOrders: ordersArray.length,
            pendingOrders: ordersArray.filter(o => o.status === 'pending').length,
            totalRevenue
          }));
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ OPTIMIZED: Lazy load products
  const loadProducts = useCallback(async () => {
    if (products.length > 0) return;

    const transformProducts = (sourceProducts, prefix, type) =>
      sourceProducts.map(product => ({
        _id: `${prefix}-${product.id}`,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: { name: product.category },
        stock: product.stock,
        sku: product.id,
        brand: product.brand,
        rating: product.rating,
        reviewCount: product.reviewCount || product.reviews,
        isNew: product.isNew,
        isHot: product.isHot,
        inStock: product.inStock !== false,
        productType: type,
        discount: product.discount
      }));

    const allProducts = [
      ...transformProducts(electronicsProducts, 'electronics', 'Electronics'),
      ...transformProducts(specialOffers, 'special', 'Special Offer'),
      ...transformProducts(newArrivals, 'new', 'New Arrival'),
      ...transformProducts(hotDeals, 'hot', 'Good Deal'),
      ...transformProducts(mockDeals, 'today', "Today's Deal"),
    ];

    setProducts(allProducts);
    setNewArrivalsState(transformProducts(newArrivals, 'new', 'New Arrival'));
    setGoodDealsState(transformProducts(hotDeals, 'hot', 'Good Deal'));
    setTodaysDealsState(transformProducts(mockDeals, 'today', "Today's Deal"));
    setSpecialOffersState(transformProducts(specialOffers, 'special', 'Special Offer'));
  }, [products.length]);

  // ✅ OPTIMIZED: Lazy load users
  const loadUsers = useCallback(async () => {
    if (users.length > 0) return;
    try {
      const res = await fetch('/api/admin/users?limit=20');
      if (res.ok) {
        const data = await res.json();
        const usersArray = Array.isArray(data) ? data : data.users || [];
        setUsers(usersArray);
        setStats(prev => ({ ...prev, totalUsers: usersArray.length }));
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  }, [users.length]);

  // ✅ NEW: Load chats
  const loadChats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chats');
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      } else {
        console.error('Failed to fetch chats');
      }
    } catch (err) {
      console.error('Error loading chats:', err);
    }
  }, []);

  // ✅ OPTIMIZED: Memoized refresh orders
  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        const ordersArray = Array.isArray(data) ? data : data.orders || [];
        ordersArray.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setOrders(ordersArray);

        const totalRevenue = ordersArray.reduce((sum, order) => sum + (order.total || 0), 0);
        setStats(prev => ({
          ...prev,
          totalOrders: ordersArray.length,
          pendingOrders: ordersArray.filter(o => o.status === 'pending').length,
          totalRevenue
        }));
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
  }, []);

  // ✅ OPTIMIZED: Memoized sign out handler
  const handleSignOut = useCallback(async () => {
    try {
      const currentLocale = locale || 'en';
      await signOut({ redirect: true, callbackUrl: `/${currentLocale}/admin-auth/login` });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [locale]);

  // ✅ OPTIMIZED: Memoized toast show
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  // ✅ OPTIMIZED: Memoized status change
  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    const orderIdString = orderId?.toString?.() || orderId;

    try {
      const response = await fetch(`/api/admin/orders/${orderIdString}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, orderId: orderIdString }),
      });

      if (response.ok) {
        setOrders(prev => prev.map(order =>
          order._id?.toString() === orderIdString || order._id === orderIdString
            ? { ...order, status: newStatus }
            : order
        ));
        showToast('Order status updated', 'success');
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Error updating status', 'error');
    }
  }, [showToast]);

  // ✅ OPTIMIZED: Memoized remove order
  const handleRemoveOrder = useCallback(async (orderId) => {
    if (!window.confirm('Are you sure you want to remove this order?')) return;

    try {
      const response = await fetch('/api/admin/orders/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        const orderToRemove = orders.find(order => order._id === orderId);
        const wasPending = orderToRemove?.status === 'pending';

        setOrders(prev => prev.filter(order => order._id !== orderId));
        setStats(prev => ({
          ...prev,
          totalOrders: prev.totalOrders - 1,
          pendingOrders: wasPending ? prev.pendingOrders - 1 : prev.pendingOrders
        }));
        showToast('Order removed', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to remove order', 'error');
      }
    } catch (error) {
      console.error('Error removing order:', error);
      showToast('Error removing order', 'error');
    }
  }, [orders, showToast]);

  // ✅ OPTIMIZED: Memoized stat cards
  const statCards = useMemo(() => [
    { label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders, color: 'bg-green-500' },
    { label: 'Total Revenue', value: formatUSD(stats.totalRevenue), color: 'bg-purple-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-yellow-500' },
  ], [stats]);

  // ✅ OPTIMIZED: Memoized tab click handler
  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
    if (['products', 'new-arrivals', 'special-offers', 'good-deals', 'todays-deals'].includes(tabId)) {
      loadProducts();
    } else if (tabId === 'users') {
      loadUsers();
    } else if (tabId === 'chats') {
      loadChats();
    }
  }, [loadProducts, loadUsers, loadChats]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{session?.user?.name || session?.user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {TAB_CONFIG.map((tab) => (
            <TabButton key={tab.id} tab={tab} activeTab={activeTab} onClick={handleTabClick} />
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {statCards.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} color={stat.color} />
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <button onClick={refreshOrders} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600" type="button">
                  Refresh
                </button>
              </div>

              {orders.length > 0 ? (
                <OrderTable orders={orders.slice(0, 10)} />
              ) : (
                <p className="text-black text-center py-8">No orders yet</p>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-black">All Orders ({orders.length})</h2>
              <button onClick={refreshOrders} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Orders
              </button>
            </div>
            {orders.length > 0 ? (
              <OrderTable orders={orders} onStatusChange={handleStatusChange} onRemove={handleRemoveOrder} />
            ) : (
              <p className="text-black text-center py-8">No orders found</p>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-black mb-6">All Products ({products.length})</h2>
            {products.length > 0 ? (
              <ProductTable products={products} type="All Products" />
            ) : (
              <p className="text-black text-center py-8">No products found</p>
            )}
          </div>
        )}

        {/* New Arrivals Tab */}
        {activeTab === 'new-arrivals' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-black mb-6">New Arrivals ({newArrivalsState.length})</h2>
            {newArrivalsState.length > 0 ? (
              <ProductTable products={newArrivalsState} type="New Arrival" />
            ) : (
              <p className="text-black text-center py-8">No new arrivals found</p>
            )}
          </div>
        )}

        {/* Special Offers Tab */}
        {activeTab === 'special-offers' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-black mb-6">Special Offers ({specialOffersState.length})</h2>
            {specialOffersState.length > 0 ? (
              <ProductTable products={specialOffersState} type="Special Offer" />
            ) : (
              <p className="text-black text-center py-8">No special offers found</p>
            )}
          </div>
        )}

        {/* Good Deals Tab */}
        {activeTab === 'good-deals' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-black mb-6">Good Deals ({goodDealsState.length})</h2>
            {goodDealsState.length > 0 ? (
              <ProductTable products={goodDealsState} type="Good Deal" />
            ) : (
              <p className="text-black text-center py-8">No good deals found</p>
            )}
          </div>
        )}

        {/* Today's Deals Tab */}
        {activeTab === 'todays-deals' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-black mb-6">Today's Deals ({todaysDealsState.length})</h2>
            {todaysDealsState.length > 0 ? (
              <ProductTable products={todaysDealsState} type="Today's Deal" />
            ) : (
              <p className="text-black text-center py-8">No today's deals found</p>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-black mb-6">Users ({users.length})</h2>
            {users.length > 0 ? (
              <UsersTable users={users} />
            ) : (
              <p className="text-black text-center py-8">No users found</p>
            )}
          </div>
        )}

        {/* Chats Tab */}
        {activeTab === 'chats' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            <div className="lg:col-span-1">
              <ChatList
                chats={chats}
                onSelectChat={setSelectedChat}
                selectedChatId={selectedChat?._id}
              />
            </div>
            <div className="lg:col-span-2">
              <ChatDetail chat={selectedChat} />
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}