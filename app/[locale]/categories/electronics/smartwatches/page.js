'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { electronicsProducts } from '../../electronics/page';

// Filter smartwatches from electronics products
const smartwatches = electronicsProducts.filter(product => product.category === 'smartwatches');

export default function SmartwatchesCategory() {
  const t = useTranslations('Smartwatches');
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Get subcategories from translations and calculate counts dynamically
  const subcategories = [
    { id: 'apple_watch', name: t('subcategories.apple_watch'), count: smartwatches.filter(p => p.brand === 'apple').length },
    { id: 'samsung_galaxy_watch', name: t('subcategories.samsung_galaxy_watch'), count: smartwatches.filter(p => p.brand === 'samsung').length },
    { id: 'fitbit', name: t('subcategories.fitbit'), count: smartwatches.filter(p => p.brand === 'fitbit').length },
    { id: 'garmin', name: t('subcategories.garmin'), count: smartwatches.filter(p => p.brand === 'garmin').length },
    { id: 'xiaomi', name: t('subcategories.xiaomi'), count: smartwatches.filter(p => p.brand === 'xiaomi').length },
    { id: 'other', name: t('subcategories.other'), count: smartwatches.filter(p => !['apple', 'samsung', 'fitbit', 'garmin', 'xiaomi'].includes(p.brand)).length }
  ];

  const brands = [
    { id: 'apple', name: t('brandNames.apple'), count: smartwatches.filter(p => p.brand === 'apple').length },
    { id: 'samsung', name: t('brandNames.samsung'), count: smartwatches.filter(p => p.brand === 'samsung').length },
    { id: 'garmin', name: t('brandNames.garmin'), count: smartwatches.filter(p => p.brand === 'garmin').length },
    { id: 'fitbit', name: t('brandNames.fitbit'), count: smartwatches.filter(p => p.brand === 'fitbit').length },
    { id: 'xiaomi', name: t('brandNames.xiaomi'), count: smartwatches.filter(p => p.brand === 'xiaomi').length },
    { id: 'huawei', name: t('brandNames.huawei'), count: smartwatches.filter(p => p.brand === 'huawei').length },
    { id: 'fossil', name: t('brandNames.fossil'), count: smartwatches.filter(p => p.brand === 'fossil').length },
    { id: 'amazfit', name: t('brandNames.amazfit'), count: smartwatches.filter(p => p.brand === 'amazfit').length }
  ];

  // Price ranges in USD - using translated values
  const priceRanges = [
    { id: '0-100', name: t('priceRanges.0-100'), value: '0-100' },
    { id: '100-300', name: t('priceRanges.100-300'), value: '100-300' },
    { id: '300-500', name: t('priceRanges.300-500'), value: '300-500' },
    { id: '500', name: t('priceRanges.500'), value: '500' },
  ];

  const filteredProducts = smartwatches.filter(product => {
    if (selectedSubcategory) {
      const brandMap = {
        'apple_watch': 'apple',
        'samsung_galaxy_watch': 'samsung',
        'fitbit': 'fitbit',
        'garmin': 'garmin',
        'xiaomi': 'xiaomi'
      };
      const targetBrand = brandMap[selectedSubcategory];
      if (selectedSubcategory === 'other') {
        if (['apple', 'samsung', 'fitbit', 'garmin', 'xiaomi'].includes(product.brand)) return false;
      } else if (product.brand !== targetBrand) {
        return false;
      }
    }
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (max && (product.price < min || product.price > max)) return false;
      if (!max && product.price < min) return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceLow':
        return a.price - b.price;
      case 'priceHigh':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(prev => prev === subcategory ? '' : subcategory);
    setCurrentPage(1);
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(prev => prev === range ? '' : range);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get sort options from translations
  const sortOptions = [
    { value: 'featured', label: t('featured') },
    { value: 'priceLow', label: t('priceLow') },
    { value: 'priceHigh', label: t('priceHigh') },
    { value: 'rating', label: t('rating') }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          {/* Subcategories */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('categories')}</h3>
            <ul className="space-y-2">
              {subcategories.map((subcategory) => (
                <li key={subcategory.id}>
                  <button
                    onClick={() => handleSubcategoryChange(subcategory.id)}
                    className={`w-full text-left px-2 py-1 rounded transition-colors ${
                      selectedSubcategory === subcategory.id
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {subcategory.name} <span className="text-gray-400 text-sm">({subcategory.count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('priceRange')}</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <div key={range.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`price-${range.id}`}
                    name="price-range"
                    checked={selectedPriceRange === range.value}
                    onChange={() => handlePriceRangeChange(range.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`price-${range.id}`} className="ml-2 text-sm text-gray-700">
                    {range.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('brands')}</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => handleBrandChange(brand.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`brand-${brand.id}`} className="ml-2 text-sm text-gray-700">
                    {brand.name} <span className="text-gray-400">({brand.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>

          {/* Sort and Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-sm text-gray-600">
              {t('showingResults', {
                start: indexOfFirstProduct + 1,
                end: Math.min(indexOfLastProduct, filteredProducts.length),
                total: filteredProducts.length
              })}
            </div>
            <div className="flex items-center">
              <label htmlFor="sort-by" className="mr-2 text-sm text-gray-700">{t('sortBy')}</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid with Fixed Alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="group border border-gray-200 rounded-lg flex flex-col h-full hover:shadow-lg transition">
                <div className="aspect-square relative w-full overflow-hidden bg-gray-100 rounded-t-lg">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={false}
                  />
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10 mb-2">
                    {product.name}
                  </h3>
                  <div className="mt-auto">
                    <p className="text-xl font-bold text-gray-900">${product.price.toLocaleString()}</p>
                    <div className="mt-2 flex items-center text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-gray-600 text-sm ml-1">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                    <Link 
                      href={`/${locale}/products/${product.id}`}
                      className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition text-center block"
                    >
                      {t('viewDetails')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('previous')}
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === number
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('next')}
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
