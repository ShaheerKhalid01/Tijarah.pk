/**
 * Recommendation Tracking Utility
 * Easy integration for tracking user interactions across the app
 * 
 * Usage:
 * import { trackInteraction } from '@/lib/recommendationTracker';
 * trackInteraction(userId, productId, 'view', { source: 'search' });
 */

/**
 * Track user interaction with product
 * @param {string} userId - User ID
 * @param {string} productId - Product ID  
 * @param {string} interactionType - view, like, purchase, cart_add, wishlist_add
 * @param {object} metadata - Additional metadata
 */
export async function trackInteraction(userId, productId, interactionType, metadata = {}) {
  if (!userId || !productId || !interactionType) {
    console.warn('Missing required parameters for tracking:', { userId, productId, interactionType });
    return;
  }

  try {
    const sessionId = getSessionId();
    
    const response = await fetch('/api/recommendations/track', {
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
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
          ...metadata,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Tracking failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking interaction:', error);
    // Don't throw error to avoid breaking user experience
  }
}

/**
 * Track product view with debouncing
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {object} options - Tracking options
 */
export function createProductViewTracker(userId, productId, options = {}) {
  const { debounceMs = 2000, source = 'direct' } = options;
  let timeoutId = null;
  let hasTracked = false;

  return () => {
    if (hasTracked || !userId || !productId) return;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      trackInteraction(userId, productId, 'view', { source });
      hasTracked = true;
    }, debounceMs);
  };
}

/**
 * Track time spent on product page
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 */
export function createTimeTracker(userId, productId) {
  let startTime = null;

  const start = () => {
    startTime = Date.now();
  };

  const end = async () => {
    if (!startTime) return;

    const duration = Math.floor((Date.now() - startTime) / 1000);
    if (duration > 0) {
      await trackInteraction(userId, productId, 'view', { duration });
    }
    startTime = null;
  };

  return { start, end };
}

/**
 * Get or create session ID for tracking
 */
function getSessionId() {
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('recommendation_session_id');
    if (!sessionId) {
      sessionId = 'rec_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('recommendation_session_id', sessionId);
    }
    return sessionId;
  }
  return null;
}

/**
 * React Hook for easy tracking
 * @param {string} userId - User ID
 * @returns {object} Tracking functions
 */
export function useTracking(userId) {
  const trackView = (productId, source = 'direct') => 
    trackInteraction(userId, productId, 'view', { source });

  const trackLike = (productId) => 
    trackInteraction(userId, productId, 'like');

  const trackCartAdd = (productId) => 
    trackInteraction(userId, productId, 'cart_add');

  const trackWishlistAdd = (productId) => 
    trackInteraction(userId, productId, 'wishlist_add');

  const trackPurchase = (productId, rating = 5) => 
    trackInteraction(userId, productId, 'purchase', { rating });

  return {
    trackView,
    trackLike,
    trackCartAdd,
    trackWishlistAdd,
    trackPurchase,
  };
}

/**
 * HOC to add tracking to ProductCard component
 */
export function withProductTracking(ProductCardComponent) {
  return function TrackedProductCard({ userId, product, ...props }) {
    const { trackView, trackCartAdd } = useTracking(userId);

    const handleClick = () => {
      trackView(product._id || product.id, 'product_card');
    };

    const handleAddToCart = (e) => {
      e.stopPropagation();
      trackCartAdd(product._id || product.id);
      // Call original addToCart if it exists
      if (props.onAddToCart) {
        props.onAddToCart(e);
      }
    };

    return (
      <div onClick={handleClick}>
        <ProductCardComponent 
          product={product} 
          {...props}
          onAddToCart={handleAddToCart}
        />
      </div>
    );
  };
}

/**
 * Batch tracking for multiple interactions
 * @param {string} userId - User ID
 * @param {Array} interactions - Array of interaction objects
 */
export async function batchTrack(userId, interactions) {
  const promises = interactions.map(({ productId, interactionType, metadata }) =>
    trackInteraction(userId, productId, interactionType, metadata)
  );

  try {
    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Error in batch tracking:', error);
  }
}
