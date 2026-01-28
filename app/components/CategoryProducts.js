'use client';

import { useSearchParams } from 'next/navigation';
import { FiFilter, FiChevronDown, FiChevronUp, FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CategoryProducts({ products = [], categoryName = '' }) {
  const searchParams = useSearchParams();
  const t = useTranslations('categories');

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found in this category.</p>
      </div>
    );
  }

  // Get filters from URL
  const sortBy = searchParams.get('sort') || 'featured';
  const page = parseInt(searchParams.get('page') || '1');

  // Sort products based on the selected option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.releaseDate || b.publishedDate) - new Date(a.releaseDate || a.publishedDate);
      case 'bestseller':
        return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
      default:
        return 0;
    }
  });

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate discount percentage
  const calculateDiscount = (price, originalPrice) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sort and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>

        <div className="flex items-center gap-4
        ">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              {t('sortBy')}:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                params.set('sort', e.target.value);
                window.location.search = params.toString();
              }}
              className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="featured">{t('sortOptions.featured')}</option>
              <option value="price-low-high">{t('sortOptions.priceLowHigh')}</option>
              <option value="price-high-low">{t('sortOptions.priceHighLow')}</option>
              <option value="rating">{t('sortOptions.highestRated')}</option>
              <option value="newest">{t('sortOptions.newest')}</option>
              <option value="bestseller">{t('sortOptions.bestsellers')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            {/* Product Image */}
            <div className="relative w-full aspect-square bg-gray-100 flex-shrink-0 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder.png';
                }}
              />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded inline-block">
                    {t('badges.new')}
                  </span>
                )}
                {product.bestSeller && (
                  <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded inline-block">
                    {t('badges.bestseller')}
                  </span>
                )}
                {product.originalPrice > product.price && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded inline-block">
                    -{calculateDiscount(product.price, product.originalPrice)}%
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all shadow-sm">
                <FiHeart className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Product Details */}
            <div className="flex flex-col flex-grow p-4">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1" title={product.title}>
                {product.title}
              </h3>
              <p className="text-xs text-gray-600 mb-1">{product.artist || product.author || product.publisher}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>

              {/* Price */}
              <div className="mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.originalPrice > product.price && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    {t('save')} {formatPrice(product.originalPrice - product.price)}
                  </p>
                )}
              </div>

              {/* Add to Cart Button */}
              <button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors">
                {t('addToCart')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <Link
              href={`?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: Math.max(1, page - 1)
              })}`}
              className={`p-2 rounded-full ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              aria-disabled={page === 1}
            >
              <FiChevronLeft className="h-5 w-5" />
            </Link>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Link
                  key={pageNum}
                  href={`?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: pageNum
                  })}`}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            <Link
              href={`?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: Math.min(totalPages, page + 1)
              })}`}
              className={`p-2 rounded-full ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              aria-disabled={page === totalPages}
            >
              <FiChevronRight className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
