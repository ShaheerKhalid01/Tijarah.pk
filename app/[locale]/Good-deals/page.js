'use client';

import { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../../contexts/CartContext';

// ✅ OPTIMIZED: Move constants outside component
const PRODUCTS_PER_PAGE = 8;

const PRICE_RANGES = [
  { id: '0-250', name: 'Under $250', value: '0-250' },
  { id: '250-500', name: '$250 - $500', value: '250-500' },
  { id: '500-1000', name: '$500 - $1000', value: '500-1000' },
  { id: '1000-1500', name: '$1000 - $1500', value: '1000-1500' },
  { id: '1500', name: 'Over $1500', value: '1500' },
];

import { hotDeals } from '@/app/lib/product-data';

// ✅ OPTIMIZED: Memoized countdown timer
const CountdownTimer = memo(({ productId, dealEnds }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(dealEnds) - new Date();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [dealEnds]);

  if (!timeLeft) return null;

  return (
    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

// ✅ OPTIMIZED: Memoized product card component
const DealCard = memo(({ product, locale, t, onAddToCart, isAdding }) => {
  const router = useRouter();

  const handleViewDetails = useCallback((e) => {
    e.stopPropagation();
    router.push(`/${locale}/products/${product.id}`);
  }, [locale, product.id, router]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  }, [product, onAddToCart]);

  const stockPercentage = useMemo(() =>
    (product.sold / product.total) * 100,
    [product.sold, product.total]
  );

  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 block"
    >
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.id}
          fill
          className="object-cover object-center group-hover:opacity-90 transition-opacity"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          loading="lazy"
        />

        {/* Discount Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            DEAL -{product.discount}%
          </span>
        </div>

        {/* Countdown Timer */}
        <CountdownTimer productId={product.id} dealEnds={product.dealEnds} />
      </div>

      {/* Stock Progress */}
      <div className="px-4 pt-3">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div
            className="bg-red-600 h-2 rounded-full transition-all"
            style={{ width: `${stockPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 text-center">
          Sold: {product.sold}/{product.total}
        </p>
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2 flex-1 min-h-[3.5rem]">
            {product.id}
          </h3>
          <div className="text-right flex-shrink-0">
            <p className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </p>
            <p className="text-lg font-bold text-red-600">
              ${product.price}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding === product.id}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            title="Add to Cart"
            type="button"
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors active:scale-95"
            type="button"
          >
            View Deal
          </button>
        </div>
      </div>
    </Link>
  );
});

DealCard.displayName = 'DealCard';

// ✅ OPTIMIZED: Memoized filter sidebar component
const FilterSidebar = memo(({
  categories,
  brands,
  priceRanges,
  selectedBrands,
  selectedPriceRange,
  onBrandToggle,
  onPriceRangeChange,
  t
}) => {
  return (
    <div className="w-full lg:w-72 flex-shrink-0">
      <div className="space-y-6 sticky top-4">
        {/* Categories */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {category.name}
                </span>
                <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Price Range
          </h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center">
                <input
                  id={`price-${range.id}`}
                  name="price-range"
                  type="radio"
                  className="h-4 w-4 text-red-600 border-gray-300 cursor-pointer"
                  checked={selectedPriceRange === range.value}
                  onChange={() => onPriceRangeChange(range.value)}
                />
                <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-gray-700 cursor-pointer">
                  {range.name}
                </label>
              </div>
            ))}
            {selectedPriceRange && (
              <button
                onClick={() => onPriceRangeChange('')}
                className="mt-2 text-sm text-red-600 hover:text-red-700"
                type="button"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Brands */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Brands
          </h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center">
                <input
                  id={`brand-${brand.id}`}
                  name="brand"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 border-gray-300 rounded cursor-pointer"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => onBrandToggle(brand.id)}
                />
                <label htmlFor={`brand-${brand.id}`} className="ml-3 text-sm text-gray-700 flex-1 cursor-pointer">
                  {brand.name}
                </label>
                <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-600">
                  {brand.count}
                </span>
              </div>
            ))}
            {selectedBrands.length > 0 && (
              <button
                onClick={() => onBrandToggle('*clear*')}
                className="mt-2 text-sm text-red-600 hover:text-red-700 w-full text-left"
                type="button"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

// ✅ OPTIMIZED: Memoized deals grid
const DealsGrid = memo(({ currentProducts, locale, t, onAddToCart, addingToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {currentProducts.map((product) => (
        <DealCard
          key={product.id}
          product={product}
          locale={locale}
          t={t}
          onAddToCart={onAddToCart}
          isAdding={addingToCart}
        />
      ))}
    </div>
  );
});

DealsGrid.displayName = 'DealsGrid';

// ✅ OPTIMIZED: Memoized pagination
const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-8"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700 suppressHydrationWarning">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          &laquo;
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          &raquo;
        </button>
      </div>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

// ✅ OPTIMIZED: Main page component
export default function GoodDealsPage() {
  const { locale } = useParams();
  const { addToCart } = useCart();
  const t = useTranslations('deals');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // ✅ Memoize categories
  const categories = useMemo(() => {
    const counts = {};
    hotDeals.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([id, count]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      count
    }));
  }, []);

  // ✅ Memoize brands
  const brands = useMemo(() => {
    const counts = {};
    hotDeals.forEach(p => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, count]) => ({ id, name: id.charAt(0).toUpperCase() + id.slice(1), count }))
      .filter(b => b.count > 0);
  }, []);

  // ✅ Memoize filtered products
  const filteredProducts = useMemo(() => {
    return hotDeals.filter((product) => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      if (selectedPriceRange) {
        const [min, max] = selectedPriceRange.split('-').map(Number);
        if (max && (product.price < min || product.price > max)) {
          return false;
        }
        if (!max && product.price < min) {
          return false;
        }
      }

      return true;
    });
  }, [selectedBrands, selectedPriceRange]);

  // ✅ Memoize sorted products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'discount-high':
        return sorted.sort((a, b) => b.discount - a.discount);
      case 'ending-soon':
      default:
        return sorted.sort((a, b) => new Date(a.dealEnds) - new Date(b.dealEnds));
    }
  }, [filteredProducts, sortBy]);

  // ✅ Memoize pagination
  const { currentProducts, totalPages, indexOfFirstProduct, indexOfLastProduct } = useMemo(() => {
    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

    return { currentProducts, totalPages, indexOfFirstProduct, indexOfLastProduct };
  }, [sortedProducts, currentPage]);

  // ✅ Memoized callbacks
  const handleBrandToggle = useCallback((brand) => {
    if (brand === '*clear*') {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(prev =>
        prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
      );
    }
    setCurrentPage(1);
  }, []);

  const handlePriceRangeChange = useCallback((range) => {
    setSelectedPriceRange(prev => prev === range ? '' : range);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddToCart = useCallback(async (product) => {
    setAddingToCart(product.id);
    try {
      await addToCart({
        id: product.id,
        name: product.id,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  }, [addToCart]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Don't miss out on these amazing deals. Limited quantities available!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <FilterSidebar
            categories={categories}
            brands={brands}
            priceRanges={PRICE_RANGES}
            selectedBrands={selectedBrands}
            selectedPriceRange={selectedPriceRange}
            onBrandToggle={handleBrandToggle}
            onPriceRangeChange={handlePriceRangeChange}
            t={t}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sorting */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-sm text-gray-700">
                Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length}
              </p>
              <select
                name="sort"
                className="block w-full sm:w-auto rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 text-gray-900"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="ending-soon">Ending Soon</option>
                <option value="discount-high">Biggest Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Products */}
            {currentProducts.length > 0 ? (
              <>
                <DealsGrid
                  currentProducts={currentProducts}
                  locale={locale}
                  t={t}
                  onAddToCart={handleAddToCart}
                  addingToCart={addingToCart}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-900">No deals found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedPriceRange('');
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                  type="button"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}