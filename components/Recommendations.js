'use client';

import { useState, useEffect } from 'react';
import { FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi';
import ProductCard from './ProductCard';

export default function Recommendations({ userId, limit = 8, title = "Recommended for You" }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('collaborative');
  const [error, setError] = useState(null);

  const recommendationTypes = [
    { id: 'collaborative', label: 'Personalized', icon: FiUsers },
    { id: 'popular', label: 'Trending', icon: FiTrendingUp },
    { id: 'similar', label: 'Similar Items', icon: FiStar },
  ];

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId, activeType]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/recommendations?userId=${userId}&limit=${limit}&type=${activeType}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Unable to load recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const trackInteraction = async (productId, interactionType) => {
    try {
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
            source: 'recommendation',
            sessionId: getSessionId(),
          }
        }),
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const getSessionId = () => {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    }
    return null;
  };

  const handleProductClick = (productId) => {
    trackInteraction(productId, 'view');
  };

  const handleAddToCart = (productId) => {
    trackInteraction(productId, 'cart_add');
  };

  if (!userId) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <FiUsers className="mx-auto text-gray-400 mb-3" size={48} />
        <p className="text-gray-600">Sign in to see personalized recommendations</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        
        {/* Type Selector */}
        <div className="flex gap-2">
          {recommendationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeType === type.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Recommendations Grid */}
      {!loading && !error && recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <div key={item.product._id} className="relative group">
                {/* Recommendation Badge */}
                <div className="absolute top-2 left-2 z-20 bg-pink-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.recommendationType === 'collaborative' && 'Personalized'}
                  {item.recommendationType === 'popular' && 'Trending'}
                  {item.recommendationType === 'similar' && 'Similar'}
                </div>
                
                {/* Product Card with tracking */}
                <div onClick={() => handleProductClick(item.product._id)}>
                  <ProductCard 
                    product={{
                      ...item.product,
                      id: item.product._id,
                      price: item.product.price,
                      originalPrice: item.product.originalPrice,
                      image: item.product.image,
                      images: item.product.images,
                      inStock: item.product.stock > 0,
                    }}
                  />
                </div>
                
                {/* Add to Cart Tracking */}
                <button
                  onClick={() => handleAddToCart(item.product._id)}
                  className="absolute bottom-4 right-4 bg-pink-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-700"
                  title="Add to cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {/* Refresh Button */}
          <div className="text-center">
            <button
              onClick={fetchRecommendations}
              className="px-6 py-2 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
            >
              Refresh Recommendations
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && recommendations.length === 0 && (
        <div className="text-center py-12">
          <FiStar className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600 mb-2">No recommendations available yet</p>
          <p className="text-gray-500 text-sm">Start browsing products to get personalized suggestions</p>
        </div>
      )}
    </div>
  );
}
