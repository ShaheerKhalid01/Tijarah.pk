'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCart } from '../../../contexts/CartContext';

// ✅ OPTIMIZED: Move constants outside component
const PRODUCTS_PER_PAGE = 8;

const PRICE_RANGES = [
  { id: '0-100', name: '$0 - $100', value: '0-100' },
  { id: '100-250', name: '$100 - $250', value: '100-250' },
  { id: '250-500', name: '$250 - $500', value: '250-500' },
  { id: '500-1000', name: '$500 - $1000', value: '500-1000' },
  { id: '1000', name: 'Over $1000', value: '1000' },
];

import { newArrivals } from '@/app/lib/product-data';

// ✅ OPTIMIZED: Memoized product card component
const ProductCard = memo(({ product, locale, t, onAddToCart, isAdding }) => {
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

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {t('badges.new')}
            </span>
          )}
          {product.isHot && (
            <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {t('badges.hot')}
            </span>
          )}
        </div>

        {/* Discount */}
        <div className="absolute top-3 right-3">
          <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{product.discount}%
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2 flex-1 min-h-[3.5rem]">
            {product.id}
          </h3>
          <div className="text-right flex-shrink-0">
            <p className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </p>
            <p className="text-lg font-bold text-blue-600">
              ${product.price}
            </p>
          </div>
        </div>

        <button
          onClick={handleViewDetails}
          disabled={isAdding === product.id}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isAdding === product.id ? t('adding') : t('viewDetails')}
        </button>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

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
            {t('filters.categories')}
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
            {t('filters.priceRange')}
          </h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center">
                <input
                  id={`price-${range.id}`}
                  name="price-range"
                  type="radio"
                  className="h-4 w-4 text-blue-600 border-gray-300 cursor-pointer"
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
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                type="button"
              >
                {t('filters.clearPrice')}
              </button>
            )}
          </div>
        </div>

        {/* Brands */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('filters.brands')}
          </h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center">
                <input
                  id={`brand-${brand.id}`}
                  name="brand"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
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
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 w-full text-left"
                type="button"
              >
                {t('filters.clearBrands')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

// ✅ OPTIMIZED: Memoized products grid
const ProductsGrid = memo(({ currentProducts, locale, t, onAddToCart, addingToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {currentProducts.map((product) => (
        <ProductCard
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

ProductsGrid.displayName = 'ProductsGrid';

// ✅ OPTIMIZED: Memoized pagination
const Pagination = memo(({ currentPage, totalPages, onPageChange, t }) => {
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
export default function NewArrivalsPage() {
  const { locale } = useParams();
  const { addToCart } = useCart();
  const t = useTranslations('NewArrivals');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // ✅ Memoize categories
  const categories = useMemo(() => {
    const counts = {};
    newArrivals.forEach(p => {
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
    newArrivals.forEach(p => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, count]) => ({ id, name: id.charAt(0).toUpperCase() + id.slice(1), count }))
      .filter(b => b.count > 0);
  }, []);

  // ✅ Memoize filtered products
  const filteredProducts = useMemo(() => {
    return newArrivals.filter((product) => {
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
      default:
        return sorted;
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
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t('subtitle')}
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
                className="block w-full sm:w-auto rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="featured">{t('sort.featured')}</option>
                <option value="discount-high">{t('sort.discountHigh')}</option>
                <option value="price-low">{t('sort.priceLow')}</option>
                <option value="price-high">{t('sort.priceHigh')}</option>
              </select>
            </div>

            {/* Products */}
            {currentProducts.length > 0 ? (
              <>
                <ProductsGrid
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
                  t={t}
                />
              </>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-900">{t('noProducts.title')}</h3>
                <p className="mt-1 text-gray-500">{t('noProducts.description')}</p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedPriceRange('');
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  type="button"
                >
                  {t('noProducts.clearFilters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}