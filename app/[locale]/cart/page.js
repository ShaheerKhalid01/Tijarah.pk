// app/[locale]/cart/page.js
'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

// ✅ OPTIMIZED: Extract EmptyCart component
const EmptyCart = memo(() => (
  <div className="text-center py-16 bg-white rounded-xl shadow-sm">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <FiShoppingCart className="h-12 w-12 text-gray-400" />
    </div>
    <h2 className="text-2xl font-bold text-black mb-2">Your cart is empty</h2>
    <p className="text-black mb-8 max-w-md mx-auto">
      Looks like you haven't added anything to your cart yet.
    </p>
    <Link
      href="/categories"
      className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      Continue Shopping
    </Link>
  </div>
));

EmptyCart.displayName = 'EmptyCart';

// ✅ OPTIMIZED: Extract CartItem component
const CartItem = memo(({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleDecrement = useCallback(() => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  }, [item.id, item.quantity, onUpdateQuantity]);

  const handleIncrement = useCallback(() => {
    onUpdateQuantity(item.id, item.quantity + 1);
  }, [item.id, item.quantity, onUpdateQuantity]);

  const handleRemove = useCallback(() => {
    onRemoveItem(item.id);
  }, [item.id, onRemoveItem]);

  const itemTotal = useMemo(() => 
    (item.price * item.quantity).toFixed(2),
    [item.price, item.quantity]
  );

  return (
    <div className="p-6 border-b border-gray-200 last:border-b-0">
      <div className="flex">
        <div className="shrink-0 h-24 w-24 rounded-md overflow-hidden border border-gray-200">
          <Image
            src={item.image || '/placeholder-product.jpg'}
            alt={item.name || 'Product image'}
            width={96}
            height={96}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>

        <div className="ml-4 flex-1 flex flex-col">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium text-black">
              {item.name}
            </h3>
            <p className="ml-4 text-sm font-medium text-black">
              ${itemTotal}
            </p>
          </div>
          <p className="mt-1 text-sm text-black">
            {item.brand || 'Generic Brand'}
          </p>

          <div className="flex-1 flex items-end justify-between text-sm">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={handleDecrement}
                className="px-3 py-1 text-black hover:bg-gray-100 transition-colors"
                type="button"
                aria-label="Decrease quantity"
              >
                <FiMinus className="h-4 w-4" />
              </button>
              <span className="px-4 py-1 border-x border-gray-300 text-black">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="px-3 py-1 text-black hover:bg-gray-100 transition-colors"
                type="button"
                aria-label="Increase quantity"
              >
                <FiPlus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="font-medium text-red-600 hover:text-red-500 flex items-center transition-colors"
              aria-label="Remove item from cart"
            >
              <FiTrash2 className="mr-1 h-4 w-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

// ✅ OPTIMIZED: Extract CartItems component
const CartItems = memo(({ items, onUpdateQuantity, onRemoveItem }) => (
  <div className="lg:w-2/3">
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  </div>
));

CartItems.displayName = 'CartItems';

// ✅ OPTIMIZED: Extract OrderSummary component
const OrderSummary = memo(({ subtotal, total, locale }) => (
  <div className="mt-8 lg:mt-0 lg:w-1/3">
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-medium text-black mb-6">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-black">Subtotal</span>
          <span className="font-medium text-black">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-4">
          <span className="text-black">Shipping</span>
          <span className="font-medium text-black">
            {subtotal > 0 ? '$5.99' : 'Free'}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-4 text-black">
          <span className="text-black">Total</span>
          <span className="text-black">${total.toFixed(2)}</span>
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
      <h3 className="text-sm font-medium text-black mb-4">Need help?</h3>
      <p className="text-sm text-black mb-4">
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
));

OrderSummary.displayName = 'OrderSummary';

// ✅ OPTIMIZED: Extract CartHeader component
const CartHeader = memo(({ itemCount, onBack }) => (
  <div className="flex items-center mb-8">
    <button
      onClick={onBack}
      className="flex items-center text-black hover:text-gray-700 mr-4 transition-colors"
      type="button"
      aria-label="Go back"
    >
      <FiArrowLeft className="mr-2" />
    </button>
    <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
    <span className="ml-4 bg-gray-200 text-black text-sm font-medium px-3 py-1 rounded-full">
      {itemCount} {itemCount === 1 ? 'item' : 'items'}
    </span>
  </div>
));

CartHeader.displayName = 'CartHeader';

export default function CartPage() {
  const router = useRouter();
  const params = useParams();
  const { cart: cartItems, updateItemQuantity, removeFromCart } = useCart();
  
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // ✅ OPTIMIZED: Memoized locale
  const locale = useMemo(() => params?.locale || 'en', [params?.locale]);

  // ✅ OPTIMIZED: Memoized showNotification
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    const timer = setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ OPTIMIZED: Memoized updateQuantity handler
  const handleUpdateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) return;
    if (updateItemQuantity) {
      updateItemQuantity(id, newQuantity);
    }
  }, [updateItemQuantity]);

  // ✅ OPTIMIZED: Memoized removeItem handler
  const handleRemoveItem = useCallback((id) => {
    if (removeFromCart) {
      removeFromCart(id);
      showNotification('Item removed from cart');
    }
  }, [removeFromCart, showNotification]);

  // ✅ OPTIMIZED: Memoized back handler
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // ✅ OPTIMIZED: Memoized calculations
  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
  }, [cartItems]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <CartHeader itemCount={cartItems.length} onBack={handleBack} />

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="lg:flex lg:space-x-8">
              <CartItems
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />

              <OrderSummary
                subtotal={calculations.subtotal}
                total={calculations.total}
                locale={locale}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}