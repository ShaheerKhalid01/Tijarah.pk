'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

// Currency conversion rates (can be updated from API or config)
const CURRENCY_RATES = {
  PKR_TO_USD: 0.0036, // 1 PKR = 0.0036 USD (approximate)
};

// Helper for currency formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format((amount || 0) * CURRENCY_RATES.PKR_TO_USD);
};

// Mock data for smartphones
export const smartphones = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro',
    price: 799,
    originalPrice: 899,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1695639509828-d4260075e370?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1710023038502-ba80a70a9f53?w=600&h=600&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 145,
    brand: 'apple',
    category: 'smartphones',
    inStock: true,
    isNew: true,
    isHot: true,
    description: 'Latest iPhone with advanced A17 Pro chip, stunning display, and professional camera system.',
    stock: 25
  }
];

// Calculate category counts
const calculateCategoryCounts = (products) => {
  const counts = {};
  products.forEach(product => {
    counts[product.category] = (counts[product.category] || 0) + 1;
  });
  return counts;
};

const categoryCounts = calculateCategoryCounts(smartphones);

// Category names mapping
const categoryNames = {
  'smartphones': 'Smartphones',
  'flagship': 'Flagship Phones',
  'mid-range': 'Mid-Range Phones',
  'budget': 'Budget Phones',
  'foldable': 'Foldable Phones',
  'gaming': 'Gaming Phones'
};

// Calculate brand counts
const calculateBrandCounts = (products) => {
  const counts = {};
  products.forEach(product => {
    counts[product.brand] = (counts[product.brand] || 0) + 1;
  });
  return counts;
};

const brandCounts = calculateBrandCounts(smartphones);

// Generate subcategories from category names
const subcategories = Object.entries(categoryNames).map(([id, name]) => ({
  id,
  name,
  count: categoryCounts[id] || 0
}));

// Brands filter with dynamic counts
const brands = [
  { id: 'apple', name: 'Apple', count: brandCounts['apple'] || 0 },
  { id: 'samsung', name: 'Samsung', count: brandCounts['samsung'] || 0 },
  { id: 'google', name: 'Google', count: brandCounts['google'] || 0 },
  { id: 'xiaomi', name: 'Xiaomi', count: brandCounts['xiaomi'] || 0 },
  { id: 'oneplus', name: 'OnePlus', count: brandCounts['oneplus'] || 0 },
  { id: 'oppo', name: 'Oppo', count: brandCounts['oppo'] || 0 },
  { id: 'vivo', name: 'Vivo', count: brandCounts['vivo'] || 0 }
];

// Price ranges in USD
const priceRanges = [
  { id: 'under-500', value: '0-500', label: 'Under $500' },
  { id: '500-1000', value: '500-1000', label: '$500 - $1,000' },
  { id: '1000-1500', value: '1000-1500', label: '$1,000 - $1,500' },
  { id: 'over-1500', value: '1500-0', label: 'Over $1,500' }
];

export default function SmartphonesPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = useTranslations('Smartphones');
  const tProducts = useTranslations('products');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = smartphones.filter(product => {
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
      case 'rating':
        return b.rating - a.rating;
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">{t('title')}</h1>
          <p className="mt-4 text-xl text-blue-100">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="space-y-6">
              {/* Categories */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('categories')}</h3>
                <div className="space-y-2">
                  {subcategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <Link 
                        href={`/${locale}/categories/electronics/smartphones/${category.id}`}
                        className="text-gray-600 hover:text-blue-600 text-sm"
                      >
                        {category.name}
                      </Link>
                      <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('priceRange')}</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        id={range.id}
                        type="radio"
                        name="price-range"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedPriceRange === range.value}
                        onChange={() => handlePriceRangeChange(range.value)}
                      />
                      <label htmlFor={range.id} className="ml-3 text-sm text-gray-600">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('brands')}</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <input
                        id={`brand-${brand.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => handleBrandToggle(brand.id)}
                      />
                      <label htmlFor={`brand-${brand.id}`} className="ml-3 text-sm text-gray-600">
                        {brand.name} <span className="text-gray-400">({brand.count})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                {t('showingResults', { 
                  start: indexOfFirstProduct + 1, 
                  end: Math.min(indexOfLastProduct, filteredProducts.length), 
                  total: filteredProducts.length 
                })}
              </p>
              <div className="flex items-center" style={{ color: 'black' }}>
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                  {t('sortBy')}
                </label>
                <select
                  id="sort"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-black bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  style={{ 
                    color: 'black !important',
                    WebkitTextFillColor: 'black !important',
                    opacity: '1 !important'
                  }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured" className="text-gray-900">{t('featured')}</option>
                  <option value="price-low" className="text-gray-900">{t('priceLow')}</option>
                  <option value="price-high" className="text-gray-900">{t('priceHigh')}</option>
                  <option value="rating" className="text-gray-900">{t('rating')}</option>
                </select>
              </div>
            </div>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                    <Link href={`/${locale}/products/${product.id}`} className="block">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover object-center group-hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    {product.inStock && (
                      <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {t('inStock')}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={`/${locale}/products/${product.id}`}>
                        {tProducts(`${product.id}.name`) || product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="mt-4">
                      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                        {t('addToCart')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-8 flex justify-center" aria-label="Pagination">
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">{t('previous')}</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <li key={number}>
                    <button
                      onClick={() => paginate(number)}
                      className={`px-3 py-2 leading-tight border ${
                        currentPage === number
                          ? 'z-10 text-blue-600 bg-blue-50 border-blue-300'
                          : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                      }`}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">{t('next')}</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}