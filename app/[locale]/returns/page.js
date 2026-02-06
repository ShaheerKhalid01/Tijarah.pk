'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useCart } from '../../../contexts/CartContext';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import ConfirmDialog from '../../components/ConfirmDialog';
import { electronicsProducts } from '../categories/electronics/page';

const ReturnsAndOrdersPage = () => {
  const t = useTranslations('ReturnsAndOrders');
  const router = useRouter();
  const { clearCart } = useCart();
  const { dialog, showConfirm, closeDialog } = useConfirmDialog();

  const [activeTab, setActiveTab] = useState('orders');
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  /**
   * Load orders from localStorage with proper error handling
   */
  const loadOrdersFromStorage = () => {
    if (typeof window === 'undefined') return [];
    console.log('[Orders Page] Loading orders from localStorage...');
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      console.log('[Orders Page] Orders loaded:', savedOrders.length, 'items');
      if (savedOrders.length > 0) {
        console.log('[Orders Page] Order IDs:', savedOrders.map(o => ({ id: o.id, status: o.status })));
      }
      return savedOrders;
    } catch (error) {
      console.error('[Orders Page] Error parsing orders from localStorage:', error);
      return [];
    }
  };

  /**
   * Load returns from localStorage with proper error handling
   */
  const loadReturnsFromStorage = () => {
    if (typeof window === 'undefined') return [];
    console.log('[Orders Page] Loading returns from localStorage...');
    try {
      const savedReturns = JSON.parse(localStorage.getItem('returns') || '[]');
      console.log('[Orders Page] Returns loaded:', savedReturns.length, 'items');
      return savedReturns;
    } catch (error) {
      console.error('[Orders Page] Error parsing returns from localStorage:', error);
      return [];
    }
  };

  /**
   * Initial load and refresh on mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const savedOrders = loadOrdersFromStorage();
        const savedReturns = loadReturnsFromStorage();

        setOrders(savedOrders);
        setReturns(savedReturns);
      } catch (error) {
        console.error('[Orders Page] Error fetching data:', error);
        toast.error(t('errors.fetchError') || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // Add item to cart
  const addProductToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      title: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category,
      brand: product.brand
    };

    if (typeof window === 'undefined') return;
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = currentCart.find(item => item.id === product.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = currentCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
      toast.success(`${product.name} quantity updated!`);
    } else {
      updatedCart = [...currentCart, cartItem];
      toast.success(`${product.name} added to cart!`);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const getCartCount = () => {
    if (typeof window === 'undefined') return 0;
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    } catch (e) {
      return 0;
    }
  };

  const createOrderFromCart = () => {
    if (typeof window === 'undefined') return;
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length === 0) {
        toast.error('Your cart is empty. Add some products first.');
        return;
      }
      const validItems = cart.filter(item =>
        item && item.id && (item.name || item.title) && item.price && item.price > 0
      );
      if (validItems.length === 0) {
        toast.error('No valid items in cart.');
        return;
      }
      const newOrder = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'processing',
        items: validItems.map((item, idx) => ({
          ...item,
          cartItemId: `${item.id}-${idx}`,
          orderItemId: `${Date.now()}-${item.id}-${idx}`
        })),
        total: validItems.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0),
        subtotal: validItems.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0),
        shipping: 0,
        tax: 0,
        shippingAddress: 'User Address - Will be collected during checkout',
        paymentMethod: 'Pending - Will be collected during checkout',
        statusDescription: 'Order placed successfully.',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      clearCart();
      toast.success(`Order ${newOrder.id} placed successfully!`);
      setActiveTab('orders');
    } catch (error) {
      console.error('Error in createOrderFromCart:', error);
      toast.error('Failed to create order.');
    }
  };

  /**
   * FIXED: Remove order with proper state management
   */
  const handleRemoveOrder = (orderId) => {
    console.log('[Orders Page] ===== REMOVE ORDER START =====');
    console.log('[Orders Page] Attempting to remove order:', orderId);
    console.log('[Orders Page] Current UI orders:', orders);

    if (!window.confirm('Are you sure you want to remove this order? This action cannot be undone.')) {
      console.log('[Orders Page] Removal cancelled by user');
      return;
    }

    try {
      // Step 1: Load fresh data from localStorage
      const currentOrders = loadOrdersFromStorage();
      console.log('[Orders Page] Step 1 - Fresh orders from storage:', currentOrders);

      // Step 2: Find the order to remove
      const orderToRemove = currentOrders.find(o => {
        const matches = o.id === orderId;
        console.log('[Orders Page] Step 2 - Comparing:', o.id, '===', orderId, '=', matches);
        return matches;
      });

      if (!orderToRemove) {
        console.error('[Orders Page] ERROR: Order not found for removal:', orderId);
        console.log('[Orders Page] Available order IDs:', currentOrders.map(o => o.id));
        toast.error('Order not found!');
        return;
      }

      console.log('[Orders Page] Step 3 - Found order to remove:', orderToRemove);

      // Step 3: Filter out the order
      const updatedOrders = currentOrders.filter(order => {
        const shouldKeep = order.id !== orderId;
        console.log('[Orders Page] Filtering - Keeping order', order.id, '?', shouldKeep);
        return shouldKeep;
      });

      console.log('[Orders Page] Step 4 - Orders after filtering:', updatedOrders);
      console.log('[Orders Page] Step 5 - Removed count:', currentOrders.length - updatedOrders.length);

      // Step 4: Verify removal happened
      if (updatedOrders.length === currentOrders.length) {
        console.error('[Orders Page] ERROR: Filtering failed! No orders were removed');
        toast.error('Failed to remove order - filtering returned no changes');
        return;
      }

      // Step 5: Save to localStorage
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      console.log('[Orders Page] Step 6 - Orders saved to localStorage');

      // Step 6: Update React state
      setOrders(updatedOrders);
      console.log('[Orders Page] Step 7 - State updated');

      // Step 7: Clear selections
      setSelectedOrders(prev => prev.filter(id => id !== orderId));

      // Step 8: Show success
      toast.success('Order removed successfully!');
      console.log('[Orders Page] ===== REMOVE ORDER COMPLETE =====');

    } catch (error) {
      console.error('[Orders Page] ERROR during removal:', error);
      console.error('[Orders Page] Error stack:', error.stack);
      toast.error('Error removing order: ' + error.message);
    }
  };

  /**
   * FIXED: Remove item from order
   */
  const handleRemoveItemFromOrder = (orderId, itemId) => {
    console.log('[Orders Page] Removing item:', itemId, 'from order:', orderId);

    if (!window.confirm('Remove this item from the order?')) {
      return;
    }

    try {
      const currentOrders = loadOrdersFromStorage();

      const updatedOrders = currentOrders.map(order => {
        if (order.id === orderId) {
          console.log('[Orders Page] Found order, removing item');

          const updatedItems = order.items.filter(item => {
            const itemIdentifier = item.cartItemId || item.id || item.productId;
            const shouldKeep = itemIdentifier !== itemId;
            console.log('[Orders Page] Item check:', itemIdentifier, '!==', itemId, '=', shouldKeep);
            return shouldKeep;
          });

          console.log('[Orders Page] Items after removal:', updatedItems.length);

          if (updatedItems.length === 0) {
            console.log('[Orders Page] No items left, removing entire order');
            return null;
          }

          const newTotal = updatedItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * (item.quantity || 1));
          }, 0);

          return {
            ...order,
            items: updatedItems,
            total: newTotal,
            subtotal: newTotal,
            updatedAt: new Date().toISOString(),
            statusDescription: 'Item removed from order'
          };
        }
        return order;
      }).filter(Boolean);

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);

      toast.success('Item removed from order successfully!');
      console.log('[Orders Page] Item removal complete');

    } catch (error) {
      console.error('[Orders Page] Error removing item:', error);
      toast.error('Error removing item: ' + error.message);
    }
  };

  /**
   * FIXED: Cancel order
   */
  const handleCancelOrder = (orderId) => {
    console.log('[Orders Page] Cancelling order:', orderId);

    if (!window.confirm(t('confirmCancelOrder') || 'Cancel this order?')) {
      return;
    }

    try {
      const currentOrders = loadOrdersFromStorage();

      const updatedOrders = currentOrders.map(order =>
        order.id === orderId
          ? {
            ...order,
            status: 'cancelled',
            statusDescription: 'Order cancelled by customer'
          }
          : order
      );

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);

      toast.success(t('orderCancelled') || 'Order cancelled successfully!');
      console.log('[Orders Page] Order cancellation complete');

    } catch (error) {
      console.error('[Orders Page] Error cancelling order:', error);
      toast.error('Error cancelling order: ' + error.message);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAllOrders = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleReturnItems = () => {
    if (selectedOrders.length === 0) {
      toast.error(t('noOrdersSelected') || 'No orders selected');
      return;
    }

    const newReturns = selectedOrders.map(orderId => {
      const order = orders.find(o => o.id === orderId);
      if (!order) return null;

      return {
        id: `RTN-${Date.now()}-${orderId}`,
        orderId: orderId,
        date: new Date().toISOString().split('T')[0],
        status: 'return_requested',
        items: order.items.map(item => ({
          ...item,
          reason: 'Customer request',
          returnReason: 'No longer needed',
          condition: 'Unused'
        })),
        refundAmount: order.total,
        refundMethod: 'Original payment method',
        statusDescription: 'Return request submitted'
      };
    }).filter(Boolean);

    const existingReturns = JSON.parse(localStorage.getItem('returns') || '[]');
    const updatedReturns = [...newReturns, ...existingReturns];
    localStorage.setItem('returns', JSON.stringify(updatedReturns));
    setReturns(updatedReturns);

    const updatedOrders = orders.map(order =>
      selectedOrders.includes(order.id)
        ? { ...order, status: 'return_requested' }
        : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);

    setSelectedOrders([]);
    toast.success(`${newReturns.length} return request(s) submitted successfully!`);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'processing': { text: t('status.processing'), color: 'bg-amber-100 text-amber-700' },
      'shipped': { text: t('status.shipped'), color: 'bg-blue-100 text-blue-700' },
      'delivered': { text: t('status.delivered'), color: 'bg-emerald-100 text-emerald-700' },
      'cancelled': { text: t('status.cancelled'), color: 'bg-rose-100 text-rose-700' },
      'return_requested': { text: t('status.returnRequested'), color: 'bg-violet-100 text-violet-700' },
    };

    const statusInfo = statusMap[status] || { text: status, color: 'bg-slate-100 text-slate-700' };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color} tracking-wide`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(router.locale, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(router.locale, {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h1 className="text-4xl font-bold text-slate-900">
              {t('title')}
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Create Order Section */}
        <div className="mb-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 sm:p-8 shadow-lg overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-400 rounded-full opacity-10"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">Create Order from Cart</h3>
                <p className="text-blue-100 text-sm">
                  Add products to your cart and create an order. Cart: <span className="font-mono text-lg text-white">({getCartCount()} items)</span>
                </p>
                <button
                  onClick={() => setShowProducts(!showProducts)}
                  className="inline-block text-sm text-blue-100 hover:text-white font-semibold underline transition-colors"
                >
                  {showProducts ? '📦 Hide Available Products' : '🛍️ Show Available Products'}
                </button>
              </div>
              <button
                onClick={createOrderFromCart}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Order
              </button>
            </div>

            {showProducts && (
              <div className="mt-8 pt-8 border-t border-blue-400">
                <h4 className="text-white font-bold mb-5">Available Electronics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {electronicsProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h5>
                          <p className="text-xs text-slate-500">{product.brand}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-blue-600">${product.price}</span>
                            {product.discount > 0 && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">-{product.discount}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => addProductToCart(product)}
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b-2 border-slate-200">
          {['orders', 'returns'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-bold transition-all ${activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {t(`tabs.${tab}`)} ({tab === 'orders' ? orders.length : returns.length})
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : activeTab === 'orders' ? (
          orders.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">No Orders</h3>
              <p className="text-slate-600 mt-2">Add products to cart and create an order to see it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className="text-sm text-slate-600">
                          {t('orderPlaced')} <span className="font-mono">{formatDate(order.date)}</span>
                        </p>
                        <p className="text-lg font-bold text-slate-900 mt-1">
                          Order <span className="text-blue-600">{order.id}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                        <span className="text-2xl font-bold text-slate-900">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={item.cartItemId || `${item.id}-${idx}`} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900">{item.name}</h4>
                          <p className="text-sm text-slate-600 mt-1">Qty: {item.quantity}</p>
                          <p className="text-lg font-bold text-blue-600 mt-2">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItemFromOrder(order.id, item.cartItemId || item.id)}
                          className="text-rose-500 hover:text-rose-700 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-slate-600">{order.statusDescription}</p>
                    <div className="flex gap-2 w-full sm:w-auto">
                      {order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="flex-1 px-4 py-2 bg-rose-100 text-rose-700 font-semibold rounded-lg hover:bg-rose-200 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveOrder(order.id)}
                        className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : returns.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <h3 className="text-xl font-bold">No Returns</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map((returnItem) => (
              <div key={returnItem.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{t('return')} {returnItem.id}</p>
                    <p className="text-sm text-slate-600">{formatDate(returnItem.date)}</p>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(returnItem.refundAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnsAndOrdersPage;