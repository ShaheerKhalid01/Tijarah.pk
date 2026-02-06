'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiClock, FiFilter, FiChevronDown, FiShoppingCart, FiStar } from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';

// Mock data for deals with real Unsplash images
import { mockDeals } from '@/app/lib/product-data';

// Calculate time remaining until midnight
const calculateTimeRemaining = () => {
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const timeRemaining = endOfDay - now;

  if (timeRemaining <= 0) {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(23, 59, 59, 999);
    return nextDay - now;
  }

  return timeRemaining;
};

// Convert milliseconds to hours, minutes, seconds
const getTimeFormat = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds)
  };
};

// Product Card Component - Single Image Only (No Navigation)
const ProductCard = ({ product, onAddToCart, t }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image Container - Single Image Only */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md z-10">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col h-full">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
          {product.brand}
        </p>
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 flex-grow">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Sold Count */}
        <p className="text-xs text-gray-500 mb-3">
          {t('sold')} {product.sold}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
        >
          <FiShoppingCart size={16} />
          {t('add_to_cart')}
        </button>
      </div>
    </div>
  );
};

export default function TodaysDeals() {
  const t = useTranslations('deals');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    discount: 'all',
    sort: 'popular'
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize timer on mount
  useEffect(() => {
    const timeRemaining = calculateTimeRemaining();
    const initialTime = getTimeFormat(timeRemaining);
    setTimeLeft(initialTime);

    const timer = setInterval(() => {
      const timeRemaining = calculateTimeRemaining();
      const newTime = getTimeFormat(timeRemaining);
      setTimeLeft(newTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate fetching deals
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockDeals);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`, {
      position: 'bottom-center',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '8px',
      },
    });
  };

  const formatTime = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
            <div className="flex flex-col items-center justify-center space-y-4 mb-6">
              <p className="text-blue-100 text-sm font-semibold tracking-wide">{t('subtitle')}</p>
              <div className="flex items-center justify-center space-x-4">
                <FiClock className="h-6 w-6 animate-bounce" />
                <div className="flex space-x-2">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                    <span className="font-mono text-2xl font-bold">{formatTime(timeLeft.hours)}</span>
                    <div className="text-xs uppercase mt-1">{t('hours')}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                    <span className="font-mono text-2xl font-bold">{formatTime(timeLeft.minutes)}</span>
                    <div className="text-xs uppercase mt-1">{t('minutes')}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                    <span className="font-mono text-2xl font-bold">{formatTime(timeLeft.seconds)}</span>
                    <div className="text-xs uppercase mt-1">{t('seconds')}</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-blue-100 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
              {t('deals_count', { count: products.length })}
            </h2>

            <div className="flex space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiFilter className="h-4 w-4" />
                  <span>{t('filters')}</span>
                  <FiChevronDown className="h-4 w-4" />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">{t('filter_by_category')}</h3>
                      <div className="space-y-2">
                        {['all', 'electronics', 'fashion', 'home', 'beauty'].map(category => (
                          <label key={category} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={filters.category === category}
                              onChange={() => handleFilterChange('category', category)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700 capitalize">
                              {t(`categories.${category}`)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 my-2"></div>

                    <div className="px-4 py-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">{t('filter_by_discount')}</h3>
                      <div className="space-y-2">
                        {['all', '10', '20', '30', '40+'].map(discount => (
                          <label key={discount} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={filters.discount === discount}
                              onChange={() => handleFilterChange('discount', discount)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">
                              {discount === 'all' ? t('all_discounts') : `${discount}% ${t('or_more')}`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="popular">{t('sort.popular')}</option>
                  <option value="newest">{t('sort.newest')}</option>
                  <option value="discount">{t('sort.discount')}</option>
                  <option value="price_low">{t('sort.price_low')}</option>
                  <option value="price_high">{t('sort.price_high')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse h-96">
                <div className="bg-gray-200 h-48"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="mt-4 h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">{t('no_deals_found')}</h3>
            <p className="mt-2 text-sm text-gray-500">{t('try_changing_filters')}</p>
          </div>
        )}

        {/* Load More Button */}
        {products.length > 0 && (
          <div className="mt-10 text-center">
            <button className="bg-white border border-gray-300 rounded-md px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              {t('load_more')}
            </button>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('newsletter.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            {t('newsletter.description')}
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder={t('newsletter.placeholder')}
              className="flex-1 min-w-0 block w-full px-4 py-2 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              {t('newsletter.button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}