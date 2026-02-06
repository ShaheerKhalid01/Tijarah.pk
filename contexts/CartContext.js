'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(savedCart);
      updateCartCount(savedCart);
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      setCart([]);
      updateCartCount([]);
    }
  }, []);

  // Update cart count
  const updateCartCount = (cartItems) => {
    const count = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(count);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const productId = product.id || product._id;
    const existingItem = cart.find(item =>
      item.id === productId ||
      item.productId === productId ||
      item._id === productId
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item => {
        const itemId = item.id || item.productId || item._id;
        return itemId === productId
          ? { ...item, quantity: (item.quantity || 1) + quantity }
          : item;
      });
    } else {
      updatedCart = [...cart, { ...product, quantity, id: productId }];
    }

    setCart(updatedCart);
    updateCartCount(updatedCart);
    saveToLocalStorage(updatedCart);
  };

  // Debounced localStorage save
  let saveTimeout;
  const saveToLocalStorage = (cartData) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('cart', JSON.stringify(cartData));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }, 300);
  };

  /**
   * Remove item from cart
   * Supports multiple ID property names: id, productId, _id
   * 
   * @param {string} productId - The product ID to remove
   * @returns {boolean} - True if item was removed, false if not found
   */
  const removeFromCart = (productId) => {
    const itemToRemove = cart.find(item => {
      const itemId = item.id || item.productId || item._id;
      return itemId === productId;
    });

    if (!itemToRemove) {
      return false;
    }

    const updatedCart = cart.filter(item => {
      const itemId = item.id || item.productId || item._id;
      return itemId !== productId;
    });

    setCart(updatedCart);
    updateCartCount(updatedCart);
    saveToLocalStorage(updatedCart);
    return true;
  };

  /**
   * Update item quantity in cart
   * If quantity becomes 0 or less, removes the item
   * 
   * @param {string} productId - The product ID to update
   * @param {number} newQuantity - New quantity value
   * @returns {boolean} - True if update successful
   */
  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }

    const updatedCart = cart.map(item => {
      const itemId = item.id || item.productId || item._id;
      return itemId === productId
        ? { ...item, quantity: newQuantity }
        : item;
    });

    setCart(updatedCart);
    updateCartCount(updatedCart);
    saveToLocalStorage(updatedCart);
    return true;
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCart([]);
    setCartCount(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  };

  /**
   * Remove order from localStorage
   * Manages orders separately from cart
   * 
   * @param {string} orderId - The order ID to remove
   * @returns {boolean} - True if order was removed, false if not found
   */
  const removeOrder = (orderId) => {
    if (typeof window === 'undefined') return false;
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.filter(order => order.id !== orderId);

      if (updatedOrders.length !== orders.length) {
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing order:', error);
      return false;
    }
  };

  /**
   * Get total cart value
   * 
   * @returns {number} - Total price of all items in cart
   */
  const getCartTotal = () => {
    const total = cart.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);
    return total;
  };

  /**
   * Check if item is in cart
   * 
   * @param {string} productId - Product ID to check
   * @returns {boolean} - True if item is in cart
   */
  const isInCart = (productId) => {
    return cart.some(item =>
      item.id === productId ||
      item.productId === productId ||
      item._id === productId
    );
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        removeOrder,
        getCartTotal,
        isInCart
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