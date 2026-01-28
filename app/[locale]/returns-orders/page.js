'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useCart } from '../../../contexts/CartContext';
import { electronicsProducts } from '../categories/electronics/page';

const ReturnsAndOrdersPage = () => {
  const t = useTranslations('ReturnsAndOrders');
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Custom notification system
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const notification = {
      id,
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Render notifications
  useEffect(() => {
    const container = document.getElementById('notification-container');
    if (container) {
      // Clear previous notifications
      container.innerHTML = '';
      
      // Add each notification
      notifications.forEach(notification => {
        const colors = {
          success: 'bg-emerald-500 text-white',
          error: 'bg-rose-500 text-white',
          info: 'bg-blue-500 text-white',
          warning: 'bg-amber-500 text-white'
        };
        
        const icons = {
          success: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 11.414l-2.293-2.293a1 1 0 00-1.414 1.414z" clip-rule="evenodd" /></svg>',
          error: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>',
          info: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>',
          warning: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.585 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.585-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>'
        };
        
        const notificationType = notification.type;
        const colorClass = colors[notificationType] || colors.info;
        const iconSvg = icons[notificationType] || icons.info;
        
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification-item flex items-center gap-3 px-4 py-3 ${colorClass} rounded-lg shadow-lg pointer-events-auto transform transition-all duration-300 ease-out animate-slide-in`;
        notificationEl.innerHTML = `
          <div class="flex-shrink-0">
            ${iconSvg}
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium">${notification.message}</p>
          </div>
          <button class="flex-shrink-0 ml-4 hover:opacity-75 transition-opacity">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
          </button>
        `;
        
        // Add click handler for close button
        const closeBtn = notificationEl.querySelector('button');
        if (closeBtn) {
          closeBtn.onclick = () => {
            notificationEl.remove();
          };
        }
        
        container.appendChild(notificationEl);
      });
    }
  }, [notifications]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch real orders from backend so they stay in sync with admin panel
        const res = await fetch('/api/orders');
        if (!res.ok) {
          throw new Error(`Failed to fetch orders. Status: ${res.status}`);
        }

        const data = await res.json();
        const ordersArray = Array.isArray(data) ? data : data.orders || [];

        // Newest first
        ordersArray.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        setOrders(ordersArray);
        setReturns([]); // backend returns flow not wired yet
      } catch (error) {
        console.error('Error fetching data from /api/orders:', error);
        toast.error(t('errors.fetchError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const addProductToCart = (product) => {
    console.log('Adding product to cart:', product.name);
    
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      console.log('Cannot add to cart during SSR');
      return;
    }
    
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
    
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = currentCart.find(item => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = currentCart.map(item =>
        item.id === product.id 
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
      console.log('Product quantity updated');
      showNotification(`${product.name} quantity updated!`, 'success');
    } else {
      updatedCart = [...currentCart, cartItem];
      console.log('Product added to cart');
      showNotification(`${product.name} added to cart!`, 'success');
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log('Cart saved to localStorage');
  };

  const getCartCount = () => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return 0;
    
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  };

  const createOrderFromCart = () => {
    console.log('Create order button clicked');
    
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      console.log('Cannot create order during SSR');
      showNotification('Cannot create order during server-side rendering.', 'error');
      return;
    }
    
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('Current cart:', cart);
      
      if (cart.length === 0) {
        console.log('Cart is empty');
        showNotification('Your cart is empty. Add some products first.', 'error');
        return;
      }

      const validItems = cart.filter(item => 
        item && item.id && (item.name || item.title) && item.price && item.price > 0
      );

      console.log('Valid items:', validItems);

      if (validItems.length === 0) {
        console.log('No valid items');
        showNotification('No valid items in cart.', 'error');
        return;
      }

      const newOrder = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'processing',
        items: validItems.map((item, index) => ({
          ...item,
          cartItemId: `${item.id}-${index}`,
          orderItemId: `${Date.now()}-${item.id}-${index}`
        })),
        total: validItems.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 1;
          return sum + (price * quantity);
        }, 0),
        subtotal: validItems.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 1;
          return sum + (price * quantity);
        }, 0),
        shipping: 0,
        tax: 0,
        shippingAddress: 'User Address - Will be collected during checkout',
        paymentMethod: 'Pending - Will be collected during checkout',
        statusDescription: 'Order placed successfully. Processing payment and preparing for shipment.',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('New order created:', newOrder);

      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);

      clearCart();
      
      const successMessage = `Order ${newOrder.id} placed successfully! Total: ${formatCurrency(newOrder.total)}`;
      console.log('Success:', successMessage);
      showNotification(successMessage, 'success');

      setActiveTab('orders');
      return newOrder;
    } catch (error) {
      console.error('Error in createOrderFromCart:', error);
      showNotification('Failed to create order. Please check console for details.', 'error');
    }
  };

  const handleSelectOrder = (orderId) => {
    console.log('Select order clicked:', orderId);
    
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
    
    const successMessage = 'Order selected!';
    console.log(successMessage);
    showNotification(successMessage, 'info');
  };

  const handleSelectAllOrders = (e) => {
    console.log('Select all orders clicked:', e.target.checked);
    
    if (e.target.checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
    
    const successMessage = 'All orders selected!';
    console.log(successMessage);
    showNotification(successMessage, 'info');
  };

  const handleReturnItems = () => {
    console.log('Return items clicked');
    
    if (selectedOrders.length === 0) {
      console.log('No orders selected');
      showNotification('Please select orders to return.', 'warning');
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

    console.log('New returns created:', newReturns);

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
    
    const successMessage = `${newReturns.length} return request(s) submitted successfully!`;
    console.log('Success:', successMessage);
    showNotification(successMessage, 'success');
  };

  const handleRemoveOrder = (orderId) => {
    console.log('Remove order clicked:', orderId);
    
    if (window.confirm('Remove this order?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
      
      const successMessage = 'Order removed successfully!';
      console.log(successMessage);
      showNotification(successMessage, 'success');
    }
  };

  const handleCancelOrder = (orderId) => {
    console.log('Cancel order clicked:', orderId);
    
    if (window.confirm(t('confirmCancelOrder'))) {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled', statusDescription: 'Order cancelled by customer' }
          : order
      );
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
      
      const successMessage = t('orderCancelled');
      console.log('Order cancelled:', successMessage);
      showNotification(successMessage, 'warning');
    }
  };

  const handleRemoveItemFromOrder = (orderId, itemId) => {
    console.log('Remove item clicked:', orderId, itemId);
    
    if (window.confirm('Remove this item?')) {
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          const updatedItems = order.items.filter(item => item.cartItemId !== itemId && item.id !== itemId);
          const newTotal = updatedItems.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            return sum + (price * quantity);
          }, 0);
          
          if (updatedItems.length === 0) {
            return null;
          }
          
          return {
            ...order,
            items: updatedItems,
            total: newTotal,
            subtotal: newTotal,
            updatedAt: new Date().toISOString()
          };
        }
        return order;
      }).filter(Boolean);
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      
      const successMessage = 'Item removed from order!';
      console.log(successMessage);
      showNotification(successMessage, 'success');
    }
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Space+Mono:wght@400;700&display=swap');
        
        :root {
          --primary: #2563eb;
          --primary-dark: #1e40af;
          --accent: #06b6d4;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
        }

        .font-display {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .font-mono {
          font-family: 'Space Mono', monospace;
        }

        .tab-button {
          position: relative;
          padding: 12px 20px;
          font-weight: 600;
          color: #64748b;
          transition: all 0.3s ease;
          border: none;
          background: none;
          cursor: pointer;
        }

        .tab-button.active {
          color: var(--primary);
          font-weight: 700;
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 2px;
        }

        .product-card {
          animation: slideUp 0.4s ease-out;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .order-item {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .badge-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Custom Notification Container */}
        <div id="notification-container" className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
          {/* Notifications will be rendered here */}
        </div>

        {/* Header Section */}
        <div className="mb-12 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h1 className="text-4xl font-display text-slate-900">
              {t('title')}
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Cart & Order Creation */}
        <div className="mb-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 sm:p-8 shadow-lg overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-400 rounded-full opacity-10"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-3">
                <h3 className="text-xl font-display text-white">Create Order from Cart</h3>
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

            {/* Products Grid */}
            {showProducts && (
              <div className="mt-8 pt-8 border-t border-blue-400">
                <h4 className="text-white font-bold mb-5">Available Electronics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {electronicsProducts.map((product) => (
                    <div key={product.id} className="product-card bg-white rounded-xl p-4 shadow-md">
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
              className={`tab-button capitalize tracking-wide ${activeTab === tab ? 'active' : ''}`}
            >
              {t(`tabs.${tab}`)} ({tab === 'orders' ? orders.length : returns.length})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
              </div>
            </div>
          ) : activeTab === 'orders' ? (
            orders.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-slate-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-display text-slate-900">{t('noOrders')}</h3>
                <p className="text-slate-600 mt-2">{t('noOrdersDescription')}</p>
                <Link
                  href="/"
                  className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, orderIndex) => (
                  <div
                    key={order.id || order._id || orderIndex}
                    className="order-item bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-200 overflow-hidden"
                  >
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <p className="text-sm text-slate-600">
                            {t('orderPlaced')} <span className="font-mono text-slate-900">{formatDate(order.date)}</span>
                          </p>
                          <p className="text-lg font-display text-slate-900 mt-1">
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
                      {order.items?.map((item, idx) => (
                        <div
                          key={item.cartItemId || item.id || item._id || `${idx}`}
                          className="flex gap-4 pb-4 border-b border-slate-100 last:border-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 truncate">{item.name}</h4>
                            <p className="text-sm text-slate-600 mt-1">
                              {t('quantity')}: <span className="font-mono font-bold">{item.quantity}</span>
                            </p>
                            <p className="text-lg font-bold text-blue-600 mt-2">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveItemFromOrder(order.id, item.cartItemId || item.id)}
                            className="flex-shrink-0 text-rose-500 hover:text-rose-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="px-6 py-4 bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
                      <div className="text-sm text-slate-600">
                        <p>{order.statusDescription}</p>
                        {order.estimatedDelivery && (
                          <p className="mt-1 font-semibold text-slate-900">
                            📦 Estimated: {formatDate(order.estimatedDelivery)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2 bg-rose-100 text-rose-700 font-semibold rounded-lg hover:bg-rose-200 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveOrder(order.id)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors text-sm"
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
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-slate-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-display text-slate-900">{t('noReturns')}</h3>
              <p className="text-slate-600 mt-2">{t('noReturnsDescription')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {returns.map((returnItem) => (
                <div key={returnItem.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Return submitted: {formatDate(returnItem.date)}</p>
                        <p className="text-lg font-display text-slate-900 mt-1">
                          {t('return')} <span className="text-blue-600">{returnItem.id}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(returnItem.status)}
                        <span className="text-2xl font-bold text-green-600">{formatCurrency(returnItem.refundAmount)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    {returnItem.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {t('reason')}: {item.returnReason}
                          </p>
                        </div>
                        <p className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnsAndOrdersPage;