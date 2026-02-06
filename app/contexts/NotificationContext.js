'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after duration (if specified)
    if (notification.duration !== 0 && notification.type !== 'loading') {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 3000);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addNotification({ type: 'success', message, ...options });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification({ type: 'error', message, duration: 5000, ...options });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification({ type: 'info', message, ...options });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification({ type: 'warning', message, ...options });
  }, [addNotification]);

  const cart = useCallback((message, options = {}) => {
    return addNotification({ type: 'cart', message, ...options });
  }, [addNotification]);

  const loading = useCallback((message, options = {}) => {
    return addNotification({ type: 'loading', message, duration: 0, ...options });
  }, [addNotification]);

  const dismiss = useCallback((id) => {
    removeNotification(id);
  }, [removeNotification]);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Replace alert with beautiful notification
  const alert = useCallback((message, type = 'info', options = {}) => {
    return addNotification({ type, message, ...options });
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      success,
      error,
      info,
      warning,
      cart,
      loading,
      dismiss,
      dismissAll,
      alert
    }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              {...notification}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

// Export individual hooks for convenience
export const useSuccess = () => {
  const { success } = useNotification();
  return success;
};

export const useError = () => {
  const { error } = useNotification();
  return error;
};

export const useInfo = () => {
  const { info } = useNotification();
  return info;
};

export const useWarning = () => {
  const { warning } = useNotification();
  return warning;
};

export const useCart = () => {
  const { cart } = useNotification();
  return cart;
};

export const useLoading = () => {
  const { loading } = useNotification();
  return loading;
};
