'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { electronicsProducts } from '../../electronics/page';

// Filter tablets from electronics products
const tablets = electronicsProducts.filter(product => product.category === 'tablets');

export default function TabletsCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = useTranslations('Tablets');
  const tCommon = useTranslations('common');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Get subcategories from translations
  const subcategories = [
    { id: 'ipads', name: t('subcategories.ipads'), count: 15 },
    { id: 'android', name: t('subcategories.android'), count: 20 },
    { id: 'windows', name: t('subcategories.windows'), count: 12 },
    { id: 'kids', name: t('subcategories.kids'), count: 8 }
  ];

  // Get brands from translations
  const brands = [
    { id: 'apple', name: t('brandNames.apple'), count: 10 },
    { id: 'samsung', name: t('brandNames.samsung'), count: 12 },
    { id: 'microsoft', name: t('brandNames.microsoft'), count: 8 },
    { id: 'lenovo', name: t('brandNames.lenovo'), count: 10 }
  ];

  // Get price ranges from translations
  const priceRanges = [
    { id: '0-200', name: t('priceRanges.0-200'), value: '0-200' },
    { id: '200-500', name: t('priceRanges.200-500'), value: '200-500' },
    { id: '500-1000', name: t('priceRanges.500-1000'), value: '500-1000' },
    { id: '1000', name: t('priceRanges.1000'), value: '1000' },
  ];

  // Sort options
  const sortOptions = [
    { id: 'featured', name: t('featured') },
    { id: 'price-low', name: t('priceLow') },
    { id: 'price-high', name: t('priceHigh') },
    { id: 'rating', name: t('rating') }
  ];

  const filteredProducts = tablets.filter(product => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (max && (product.price < min || product.price > max)) return false;
      if (!max && product.price < min) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">{t('title')}</h1>
          <p className="mt-4 text-xl text-blue-100">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('categories')}</h3>
                <div className="space-y-2">
                  {subcategories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between text-sm text-gray-600">
                      <Link href={`/${locale}/categories/tablets/${cat.id}`} className="hover:text-blue-600">{cat.name}</Link>
                      <span className="bg-gray-100 px-2 rounded-full">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('priceRange')}</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        className="h-4 w-4 text-blue-600 border-gray-300"
                        checked={selectedPriceRange === range.value}
                        onChange={() => { setSelectedPriceRange(range.value); setCurrentPage(1); }}
                      />
                      <label className="ml-3 text-sm text-gray-600">{range.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">
                {t('showingResults', {
                  start: indexOfFirstProduct + 1,
                  end: indexOfLastProduct > filteredProducts.length ? filteredProducts.length : indexOfLastProduct,
                  total: filteredProducts.length
                })}
              </p>
              <select className="border-gray-300 rounded-md text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
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
                    
                    {/* ALIGNED PRICE AND BUTTON */}
                    <div className="mt-auto">
                      <p className="text-xl font-bold text-gray-900">${product.price.toLocaleString()}</p>
                      <Link 
                        href={`/${locale}/products/${product.id}`}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition text-center block"
                      >
                        {t('viewDetails')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}