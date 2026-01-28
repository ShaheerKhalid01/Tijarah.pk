'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

// Mock data for smartphones
export const smartphones = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1695822822491-d92cee704368?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.8,
    description: 'Latest iPhone with A17 Pro chip and advanced camera system',
    brand: 'Apple',
    inStock: true,
    specs: {
      ram: '8GB',
      storage: '256GB',
      camera: '48MP + 12MP + 12MP',
      battery: '4422mAh',
      processor: 'A17 Pro'
    }
  },
  {
    id: 'samsung-s23-ultra',
    name: 'Samsung Galaxy S23 Ultra',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1709744722656-9b850470293f?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.7,
    description: 'Powerful Android flagship with S Pen support',
    brand: 'Samsung',
    inStock: true
  },
  {
    id: 'google-pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    price: 999,
    image: 'https://images.unsplash.com/photo-1706412703794-d944cd3625b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R29vZ2xlJTIwUGl4ZWwlMjA4JTIwUHJvfGVufDB8fDB8fHww',
    rating: 4.6,
    description: 'Best-in-class camera with Google AI features',
    brand: 'Google',
    inStock: true
  },
  {
    id: 'xiaomi-13-pro',
    name: 'Xiaomi Mi 11 Ultra',
    price: 900,
    image: 'https://images.unsplash.com/photo-1619410766515-6263877c7bfe?q=80&w=1460&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.4,
    description: 'High-end specs at a competitive price',
    brand: 'Xiaomi',
    inStock: true
  }
];

// Calculate brand counts dynamically
const calculateBrandCounts = (products) => {
  const brandCounts = {};
  products.forEach(product => {
    if (product.brand) {
      brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
    }
  });
  return brandCounts;
};

const brandCounts = calculateBrandCounts(smartphones);

// Calculate category counts dynamically
const calculateCategoryCounts = (products) => {
  const categoryCounts = {
    flagship: 0,
    'mid-range': 0,
    budget: 0,
    foldable: 0,
    gaming: 0
  };
  
  products.forEach(product => {
    if (product.price >= 1000) {
      categoryCounts.flagship++;
    } else if (product.price >= 500 && product.price < 1000) {
      categoryCounts['mid-range']++;
    } else if (product.price < 500) {
      categoryCounts.budget++;
    }
    // Note: No foldable or gaming phones in current data
  });
  
  return categoryCounts;
};

const categoryCounts = calculateCategoryCounts(smartphones);

// Subcategories for smartphones with dynamic counts
const getSubcategories = (t) => [
  { id: 'flagship', name: t('subcategories.flagship'), count: categoryCounts.flagship },
  { id: 'mid-range', name: t('subcategories.midRange'), count: categoryCounts['mid-range'] },
  { id: 'budget', name: t('subcategories.budget'), count: categoryCounts.budget },
  { id: 'foldable', name: t('subcategories.foldable'), count: categoryCounts.foldable },
  { id: 'gaming', name: t('subcategories.gaming'), count: categoryCounts.gaming }
];

// Brands filter with dynamic counts
const getBrands = (t) => [
  { id: 'apple', name: t('brandNames.apple'), count: brandCounts['Apple'] || 0 },
  { id: 'samsung', name: t('brandNames.samsung'), count: brandCounts['Samsung'] || 0 },
  { id: 'google', name: t('brandNames.google'), count: brandCounts['Google'] || 0 },
  { id: 'xiaomi', name: t('brandNames.xiaomi'), count: brandCounts['Xiaomi'] || 0 }
].filter(brand => brand.count > 0);

// Price ranges in USD
const getPriceRanges = (t) => [
  { id: '0-200', name: t('priceRanges.under200'), value: '0-200' },
  { id: '200-500', name: t('priceRanges.200to500'), value: '200-500' },
  { id: '500-1000', name: t('priceRanges.500to1000'), value: '500-1000' },
  { id: '1000-1500', name: t('priceRanges.1000to1500'), value: '1000-1500' },
  { id: '1500-2000', name: t('priceRanges.1500to2000'), value: '1500-2000' },
  { id: '2000', name: t('priceRanges.over2000'), value: '2000' },
];

export default function SmartphonesPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = useTranslations('Smartphones');
  const tProducts = useTranslations('products');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Get translated data
  const subcategories = getSubcategories(t);
  const brands = getBrands(t);
  const priceRanges = getPriceRanges(t);

  // Filter products based on selected filters
  const filteredProducts = smartphones.filter(product => {
    // Filter by category
    if (selectedCategory) {
      if (selectedCategory === 'flagship' && product.price >= 1000) return true;
      if (selectedCategory === 'mid-range' && product.price >= 500 && product.price < 1000) return true;
      if (selectedCategory === 'budget' && product.price < 500) return true;
      if (selectedCategory === 'foldable') return false; // No foldable phones in current data
      if (selectedCategory === 'gaming') return false; // No gaming phones in current data
      return false;
    }

    // Filter by brand
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand.toLowerCase())) {
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

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(prev => prev === categoryId ? '' : categoryId);
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
                      <button
                        className={`text-sm text-left w-full flex justify-between items-center rounded px-2 py-1 transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        onClick={() => handleCategoryClick(category.id)}
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
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear Category
                  </button>
                )}
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
                        {range.name}
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
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                  {t('sortBy')}
                </label>
                <select
                  id="sort"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">{t('featured')}</option>
                  <option value="price-low">{t('priceLow')}</option>
                  <option value="price-high">{t('priceHigh')}</option>
                  <option value="rating">{t('rating')}</option>
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
                        <span aria-hidden="true" className="absolute inset-0" />
                        {tProducts(`${product.id}.name`) || product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      ${product.price.toLocaleString()}
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {t('addToCart')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
}