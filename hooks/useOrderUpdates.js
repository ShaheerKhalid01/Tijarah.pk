import { useState, useEffect, useCallback, useRef } from 'react';

export function useOrderUpdates(onUpdate) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const eventSourceRef = useRef(null);
  const fallbackTimeoutRef = useRef(null);
  const connectionAttemptsRef = useRef(0);
  const maxConnectionAttempts = 5;

  const connect = useCallback(() => {
    // Clear any existing timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    connectionAttemptsRef.current += 1;

    // If we've tried too many times, use fallback
    if (connectionAttemptsRef.current > maxConnectionAttempts) {
      setUseFallback(true);
      connectionAttemptsRef.current = 0; // Reset for future attempts
      return;
    }
    
    try {
      const eventSource = new EventSource('/api/orders/updates');
      eventSourceRef.current = eventSource;
      
      // Set a timeout to fallback if SSE doesn't connect within 5 seconds
      fallbackTimeoutRef.current = setTimeout(() => {
        if (!isConnected) {
          setUseFallback(true);
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
        }
      }, 5000);
      
      eventSource.onopen = () => {
        setIsConnected(true);
        setUseFallback(false);
        connectionAttemptsRef.current = 0; // Reset on success
        if (fallbackTimeoutRef.current) {
          clearTimeout(fallbackTimeoutRef.current);
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'ping') {
            return; // Ignore ping messages
          }
          
          setLastUpdate(data);
          
          if (onUpdate && typeof onUpdate === 'function') {
            onUpdate(data);
          }
        } catch (error) {
          console.error('[useOrderUpdates] Error parsing message:', error);
        }
      };

      eventSource.onerror = (error) => {
        setIsConnected(false);
        
        // Close the failed connection
        eventSource.close();
        eventSourceRef.current = null;
        
        if (fallbackTimeoutRef.current) {
          clearTimeout(fallbackTimeoutRef.current);
        }
        
        // Switch to fallback after multiple failed attempts
        if (!useFallback) {
          setUseFallback(true);
        } else {
          // Try to reconnect if already in fallback mode, but with longer delays
          const delay = Math.min(10000 * connectionAttemptsRef.current, 30000); // Exponential backoff
          reconnectTimeoutRef.current = setTimeout(() => {
            setUseFallback(false);
            connect();
          }, delay);
        }
      };

      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        if (fallbackTimeoutRef.current) {
          clearTimeout(fallbackTimeoutRef.current);
        }
      };
    } catch (error) {
      console.error('[useOrderUpdates] Failed to create EventSource:', error);
      setIsConnected(false);
      setUseFallback(true);
      
      // Try to reconnect after a delay
      const delay = Math.min(5000 * connectionAttemptsRef.current, 15000);
      reconnectTimeoutRef.current = setTimeout(() => {
        setUseFallback(false);
        connect();
      }, delay);
    }
  }, [onUpdate, isConnected, useFallback]);

  useEffect(() => {
    const cleanup = connect();
    
    return cleanup;
  }, [connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    lastUpdate,
    connect,
    useFallback
  };
}
