// app/[locale]/cart/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const params = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const locale = params?.locale || 'en';

  useEffect(() => {
    // Simulate loading cart items
    const loadCart = () => {
      // In a real app, you would fetch this from your state management or API
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(savedCart);
      setLoading(false);
    };

    loadCart();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 ? 5.99 : 0; // Example shipping cost
    return subtotal + shipping;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <FiArrowLeft className="mr-2" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <span className="ml-4 bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FiShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                href="/categories"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="lg:flex lg:space-x-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 border-b border-gray-200 last:border-b-0">
                      <div className="flex">
                        <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name || 'Product image'}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover object-center"
                            aria-hidden={!item.name}
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="ml-4 text-sm font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.brand || 'Generic Brand'}
                          </p>
                          
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                <FiMinus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-1 border-x border-gray-300">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                <FiPlus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="font-medium text-red-600 hover:text-red-500 flex items-center"
                            >
                              <FiTrash2 className="mr-1 h-4 w-4" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-8 lg:mt-0 lg:w-1/3">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-4">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {calculateSubtotal() > 0 ? '$5.99' : 'Free'}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-4">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <Link
                      href={`/${locale}/checkout`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Proceed to Checkout
                    </Link>
                    <Link
                      href="/categories"
                      className="block text-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Need help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our customer service is available to help you with any questions about your order.
                  </p>
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}