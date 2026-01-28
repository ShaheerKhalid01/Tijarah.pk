'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, X, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Notification from '../components/Notification';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const router = useRouter();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // Update cart in localStorage and parent components
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    // Dispatch storage event to update cart count in Navbar
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedCart);
    showNotification('Cart updated');
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    updateCart(updatedCart);
    showNotification('Item removed from cart');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto lg:max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-gray-500">Start shopping to add items to your cart.</p>
              <div className="mt-6">
                <Link 
                  href="/" 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeft className="-ml-1 mr-2 h-5 w-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
              {/* Cart items */}
              <div className="lg:col-span-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <li key={`${item.id}-${item.size}`} className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover object-center"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col sm:flex-row">
                            <div className="flex-1">
                              <h4 className="text-base font-medium text-gray-900">
                                {item.name}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                Size: {item.size}
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>

                            <div className="mt-4 flex items-center sm:mt-0 sm:ml-4">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-10 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="ml-4 text-sm font-medium text-red-600 hover:text-red-500 sm:ml-6"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order summary */}
              <div className="mt-10 lg:mt-0 lg:col-span-4">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>${calculateTotal()}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={proceedToCheckout}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Checkout
                      </button>
                    </div>
                    <div className="mt-6 text-center text-sm">
                      <p>
                        or{' '}
                        <Link 
                          href="/" 
                          className="text-blue-600 font-medium hover:text-blue-500"
                        >
                          Continue Shopping<span aria-hidden="true"> &rarr;</span>
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <Notification 
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, show: false })}
          />
        </div>
      )}
    </div>
  );
};

export default CartPage;
