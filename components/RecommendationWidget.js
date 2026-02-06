'use client';

import { useState } from 'react';
import { FiStar, FiChevronRight } from 'react-icons/fi';
import { useRecommendations } from '@/hooks/useRecommendations';

export default function RecommendationWidget({ userId, limit = 4, compact = false }) {
  const { recommendations, loading, fetchRecommendations, trackView } = useRecommendations(userId);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchRecommendations('collaborative', limit);
    }
  }, [userId, fetchRecommendations, limit]);

  if (!userId) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold mb-3">Recommended for You</h3>
        <div className="space-y-3">
          {[...Array(compact ? 2 : limit)].map((_, index) => (
            <div key={index} className="animate-pulse flex gap-3">
              <div className="bg-gray-200 w-16 h-16 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const displayItems = showAll ? recommendations : recommendations.slice(0, compact ? 2 : limit);

  return (
    <div className={`bg-white rounded-lg shadow-sm ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>
          Recommended for You
        </h3>
        {!compact && recommendations.length > limit && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-pink-600 hover:text-pink-700 text-sm flex items-center gap-1"
          >
            {showAll ? 'Show Less' : 'See All'}
            <FiChevronRight className={`transform transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {displayItems.map((item) => (
          <div 
            key={item.product._id} 
            className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => trackView(item.product._id, 'widget')}
          >
            <div className="relative">
              <img
                src={item.product.image || '/placeholder-product.jpg'}
                alt={item.product.name}
                className={`object-cover rounded-lg ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}
              />
              {item.product.discount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl-lg">
                  -{item.product.discount}%
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-gray-900 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                {item.product.name}
              </h4>
              <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>
                ${item.product.price?.toFixed(2)}
              </p>
              {item.product.originalPrice && (
                <p className={`text-gray-400 line-through ${compact ? 'text-xs' : 'text-sm'}`}>
                  ${item.product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            
            <div className="flex items-center">
              <FiStar className="text-yellow-400 fill-current" size={compact ? 12 : 14} />
              <span className={`text-gray-600 ml-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                {item.product.rating?.toFixed(1) || '0.0'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {!compact && (
        <div className="mt-4 pt-3 border-t">
          <button
            onClick={() => window.location.href = '/recommendations'}
            className="w-full text-center text-pink-600 hover:text-pink-700 text-sm font-medium"
          >
            View All Recommendations
          </button>
        </div>
      )}
    </div>
  );
}
