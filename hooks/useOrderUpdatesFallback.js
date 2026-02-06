import { useState, useEffect, useCallback, useRef } from 'react';

export function useOrderUpdatesFallback(onUpdate, interval = 5000) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const processedUpdates = useRef(new Set());
  const intervalRef = useRef(null);
  
  const checkForUpdates = useCallback(async () => {
    try {
      // Don't fetch if interval is 0 (disabled)
      if (interval === 0) {
        return;
      }
      
      const response = await fetch('/api/orders/user');
      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];
        
        // Check for status changes in user's orders
        orders.forEach(order => {
          const updateKey = `${order._id}-${order.status}-${order.updatedAt}`;
          
          if (!processedUpdates.current.has(updateKey)) {
            processedUpdates.current.add(updateKey);
            
            // Keep only last 20 updates to prevent memory issues
            if (processedUpdates.current.size > 20) {
              const oldestKey = processedUpdates.current.values().next().value;
              processedUpdates.current.delete(oldestKey);
            }
            
            const update = {
              type: 'order_status_changed',
              orderId: order._id,
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              newStatus: order.status,
              timestamp: new Date().toISOString()
            };
            
            console.log('[Fallback] Detected status change:', update);
            setLastUpdate(update);
            
            if (onUpdate && typeof onUpdate === 'function') {
              onUpdate(update);
            }
          }
        });
      }
    } catch (error) {
      console.error('[Fallback] Error checking for updates:', error);
    }
  }, [onUpdate, interval]);

  useEffect(() => {
    // Don't start polling if interval is 0 (disabled)
    if (interval === 0) {
      return;
    }
    
    // Initial check
    checkForUpdates();
    setIsConnected(true);
    
    // Set up interval
    intervalRef.current = setInterval(checkForUpdates, interval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkForUpdates, interval]);

  return {
    isConnected,
    lastUpdate,
    checkForUpdates
  };
}
