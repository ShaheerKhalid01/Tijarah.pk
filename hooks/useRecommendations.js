'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for managing recommendations
 * Provides easy access to recommendation functionality
 */
export function useRecommendations(userId) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recommendations
  const fetchRecommendations = useCallback(async (type = 'collaborative', limit = 10) => {
    if (!userId) return [];

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/recommendations?userId=${userId}&limit=${limit}&type=${type}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      const recs = data.recommendations || [];
      setRecommendations(recs);
      return recs;
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Track user interaction
  const trackInteraction = useCallback(async (productId, interactionType, metadata = {}) => {
    if (!userId) return;

    try {
      const sessionId = getSessionId();
      
      await fetch('/api/recommendations/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          interactionType,
          metadata: {
            sessionId,
            ...metadata,
          }
        }),
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }, [userId]);

  // Track product view
  const trackView = useCallback((productId, source = 'direct') => {
    trackInteraction(productId, 'view', { source });
  }, [trackInteraction]);

  // Track product like
  const trackLike = useCallback((productId) => {
    trackInteraction(productId, 'like');
  }, [trackInteraction]);

  // Track cart addition
  const trackCartAdd = useCallback((productId) => {
    trackInteraction(productId, 'cart_add');
  }, [trackInteraction]);

  // Track wishlist addition
  const trackWishlistAdd = useCallback((productId) => {
    trackInteraction(productId, 'wishlist_add');
  }, [trackInteraction]);

  // Track purchase
  const trackPurchase = useCallback((productId, rating = 5) => {
    trackInteraction(productId, 'purchase', { rating });
  }, [trackInteraction]);

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    trackInteraction,
    trackView,
    trackLike,
    trackCartAdd,
    trackWishlistAdd,
    trackPurchase,
  };
}

/**
 * Get or create session ID for tracking
 */
function getSessionId() {
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
  return null;
}

/**
 * Hook for auto-tracking product views
 */
export function useProductViewTracker(userId, productId) {
  const { trackView } = useRecommendations(userId);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    if (userId && productId && !tracked) {
      // Track view after 2 seconds to avoid tracking quick bounces
      const timer = setTimeout(() => {
        trackView(productId, 'product_page');
        setTracked(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userId, productId, tracked, trackView]);
}

/**
 * Hook for tracking time spent on product
 */
export function useProductTimeTracker(userId, productId) {
  const { trackInteraction } = useRecommendations(userId);
  const startTime = useRef(null);

  const startTracking = useCallback(() => {
    startTime.current = Date.now();
  }, []);

  const endTracking = useCallback(() => {
    if (startTime.current) {
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      if (duration > 0) {
        trackInteraction(productId, 'view', { duration });
      }
      startTime.current = null;
    }
  }, [productId, trackInteraction]);

  return { startTracking, endTracking };
}
