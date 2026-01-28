'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';


// Base product data (non-translatable properties)
export const specialOffers = [
  {
    id: 'offer-1',
    price: 999,
    originalPrice: 1099,
    discount: 9,
    image: 'https://images.unsplash.com/photo-1695639509828-d4260075e370?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGlwaG9uZSUyMDE1JTIwcHJvfGVufDB8fDB8fHww',
    images: [
      'https://images.unsplash.com/photo-1695639509828-d4260075e370?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGlwaG9uZSUyMDE1JTIwcHJvfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1710023038502-ba80a70a9f53?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTUlMjBwcm98ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1695619575474-9b45e37bc1e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBob25lJTIwMTUlMjBwcm98ZW58MHx8MHx8fDA%3D'
    ],
    isNew: true,
    isHot: true,
    brand: 'apple',
    category: 'smartphones',
    stock: 15
  },
  {
    id: 'offer-2',
    price: 1199,
    originalPrice: 1299,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftc3VuZyUyMGdhbGF4eSUyMHMyNCUyMHVsdHJhfGVufDB8fDB8fHww',
    images: [
      'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftc3VuZyUyMGdhbGF4eSUyMHMyNCUyMHVsdHJhfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1705585175110-d25f92c183aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2Ftc3VuZyUyMGdhbGF4eSUyMHMyNCUyMHVsdHJhfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1705530292519-ec81f2ace70d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2Ftc3VuZyUyMGdhbGF4eSUyMHMyNCUyMHVsdHJhfGVufDB8fDB8fHww'
    ],
    isNew: true,
    isHot: true,
    brand: 'samsung',
    category: 'smartphones',
    stock: 20
  },
  {
    id: 'offer-3',
    price: 2499,
    originalPrice: 2699,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9vayUyMHBybyUyMDE2fGVufDB8fDB8fHww',
    images: [
      'https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9vayUyMHBybyUyMDE2fGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1675868374786-3edd36dddf04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFjYm9vayUyMHBybyUyMDE2fGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1675868373607-556b8fed6464?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFjYm9vayUyMHBybyUyMDE2fGVufDB8fDB8fHww'
    ],
    isNew: true,
    isHot: false,
    brand: 'apple',
    category: 'laptops',
    stock: 12
  },
  {
    id: 'offer-4',
    price: 349,
    originalPrice: 399,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1755719401541-d78b9bc9b514?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D',
    images: [
      'https://images.unsplash.com/photo-1755719401541-d78b9bc9b514?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1755719401938-35c1b24f6d15?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1761005653849-74d20f95ecc2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D'
    ],
    isNew: false,
    isHot: true,
    brand: 'sony',
    category: 'audio',
    stock: 30
  }
];

// Calculate category counts from products
const calculateCategoryCounts = (products) => {
  const categoryCounts = {};
  
  products.forEach(product => {
    if (product.category) {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    }
  });
  
  return categoryCounts;
};

// Get category counts from actual products
const categoryCounts = calculateCategoryCounts(specialOffers);

// Category names mapping
const categoryNames = {
  'electronics': 'Electronics',
  'fashion': 'Fashion',
  'home': 'Home & Kitchen',
  'beauty': 'Beauty',
  'sports': 'Sports & Outdoors',
  'toys': 'Toys & Games',
  'smartphones': 'Smartphones',
  'laptops': 'Laptops',
  'audio': 'Audio',
  'smartwatches': 'Smartwatches',
  'cameras': 'Cameras'
};

// Generate categories from actual product data
const offerCategories = Object.entries(categoryCounts).map(([id, count]) => ({
  id,
  name: categoryNames[id] || id.charAt(0).toUpperCase() + id.slice(1),
  count
}));

// Calculate brand counts from products
const calculateBrandCounts = (products) => {
  const brandCounts = {};
  
  products.forEach(product => {
    if (product.brand) {
      brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
    }
  });
  
  return brandCounts;
};

// Get brand counts from actual products
const brandCounts = calculateBrandCounts(specialOffers);

// Brands filter with dynamic counts
const brands = [
  { id: 'apple', name: 'Apple', count: brandCounts['apple'] || 0 },
  { id: 'samsung', name: 'Samsung', count: brandCounts['samsung'] || 0 },
  { id: 'sony', name: 'Sony', count: brandCounts['sony'] || 0 },
  { id: 'bose', name: 'Bose', count: brandCounts['bose'] || 0 },
  { id: 'dyson', name: 'Dyson', count: brandCounts['dyson'] || 0 },
].filter(brand => brand.count > 0);

// Price ranges
const priceRanges = [
  { id: '0-100', name: 'Under $100', value: '0-100' },
  { id: '100-250', name: '$100 - $250', value: '100-250' },
  { id: '250-500', name: '$250 - $500', value: '250-500' },
  { id: '500-1000', name: '$500 - $1000', value: '500-1000' },
  { id: '1000', name: 'Over $1000', value: '1000' },
];

// Helper function to get translated product data
export const getTranslatedProduct = (product, t) => {
  const productData = t.raw(product.id);
  return {
    ...product,
    name: productData?.name || product.id,
    description: productData?.description || '',
    colors: productData?.colors || [],
    features: productData?.features || [],
    specs: productData?.specs || {}
  };
};

export default function SpecialOffersPage() {
  const { locale } = useParams();
  const router = useRouter();
  const t = useTranslations('SpecialOffers');
  const tProducts = useTranslations('products');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Get products with translated data
  const translatedProducts = specialOffers.map(product => getTranslatedProduct(product, tProducts));

  // Filter products based on selected filters
  const filteredProducts = translatedProducts.filter((product) => {
    // Filter by brand
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }

    // Filter by price range
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

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'discount-high':
        return parseFloat(b.discount) - parseFloat(a.discount);
      default: // 'featured'
        return 0; // Keep original order for featured
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(prev => prev === range ? '' : range);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
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
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="space-y-6 sticky top-4">
              {/* Categories */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('filters.categories')}
                </h3>
                <div className="space-y-2">
                  {offerCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <button
                        className="text-gray-600 hover:text-red-600 text-sm text-left w-full flex justify-between items-center"
                        onClick={() => { }}
                      >
                        <span>
                          {category.name}
                        </span>
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
                          {category.count}
                        </span>
                      </button>
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
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        checked={selectedPriceRange === range.value}
                        onChange={() => handlePriceRangeChange(range.value)}
                      />
                      <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-gray-700">
                        {range.name}
                      </label>
                    </div>
                  ))}
                  {selectedPriceRange && (
                    <button
                      onClick={() => setSelectedPriceRange('')}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
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
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => handleBrandToggle(brand.id)}
                      />
                      <label htmlFor={`brand-${brand.id}`} className="ml-3 text-sm text-gray-700 flex-1">
                        {brand.name}
                      </label>
                      <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-600">
                        {brand.count}
                      </span>
                    </div>
                  ))}
                  {selectedBrands.length > 0 && (
                    <button
                      onClick={() => setSelectedBrands([])}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      {t('filters.clearBrands')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sorting and results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-sm text-gray-700">
                {t('pagination.showing', {
                  start: indexOfFirstProduct + 1,
                  end: Math.min(indexOfLastProduct, filteredProducts.length),
                  total: filteredProducts.length
                })}
              </p>
              <div className="flex-shrink-0">
                <label htmlFor="sort" className="sr-only">
                  Sort
                </label>
                <select
                  id="sort"
                  name="sort"
                  className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">
                    {t('sort.featured')}
                  </option>
                  <option value="discount-high">
                    {t('sort.discountHigh')}
                  </option>
                  <option value="price-low">
                    {t('sort.priceLow')}
                  </option>
                  <option value="price-high">
                    {t('sort.priceHigh')}
                  </option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${locale}/products/${product.id}`}
                    className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 block"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:opacity-90 transition-opacity"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
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
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 line-clamp-2 h-14">
                            {product.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </p>
                          <p className="text-lg font-bold text-red-600">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-gray-600 line-clamp-2 flex-1 pr-2">
                          {product.description}
                        </p>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/${locale}/products/${product.id}`);
                          }}
                        >
                          {t('viewDeal')}
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('noProducts.title')}
                </h3>
                <p className="mt-1 text-gray-500">
                  {t('noProducts.description')}
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedPriceRange('');
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {t('noProducts.clearFilters')}
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-8"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div className="flex-1 flex justify-between sm:justify-end space-x-2">
                  <button
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    aria-label={t('pagination.previous')}
                  >
                    <span className="sr-only">
                      {t('pagination.previous')}
                    </span>
                    &laquo;
                  </button>
                  <button
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    aria-label={t('pagination.next')}
                  >
                    <span className="sr-only">
                      {t('pagination.next')}
                    </span>
                    &raquo;
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
