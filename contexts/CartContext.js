'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    updateCartCount(savedCart);
  }, []);

  // Update cart count
  const updateCartCount = (cartItems) => {
    const count = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(count);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id 
          ? { ...item, quantity: (item.quantity || 1) + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity }];
    }

    setCart(updatedCart);
    updateCartCount(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    updateCartCount(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Update item quantity
  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    updateCartCount(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCartCount(0);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        cartCount, 
        addToCart, 
        removeFromCart, 
        updateItemQuantity, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
