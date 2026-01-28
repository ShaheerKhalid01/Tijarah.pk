'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for cycling products
export const cyclingProducts = [
  {
    id: 'bike-1',
    name: 'Trek Mountain Bike - 27.5"',
    price: 84999,
    image: 'https://images.unsplash.com/photo-1532298229144-0ee051189ff2?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    brand: 'Trek',
    inStock: true
  },
  {
    id: 'bike-2',
    name: 'Specialized Road Bike - Carbon',
    price: 129999,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    brand: 'Specialized',
    inStock: true
  },
  {
    id: 'helmet-1',
    name: 'Giro Cycling Helmet - MIPS',
    price: 14999,
    image: 'https://images.unsplash.com/photo-1557162168-bc234f9a0d24?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    brand: 'Giro',
    inStock: true
  },
  {
    id: 'shoes-1',
    name: 'Shimano Professional Cycling Shoes',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    brand: 'Shimano',
    inStock: true
  },
  {
    id: 'stand-1',
    name: 'Park Tool Repair Stand',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    brand: 'Park Tool',
    inStock: true
  },
  {
    id: 'computer-1',
    name: 'Garmin Edge GPS Computer',
    price: 44999,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    brand: 'Garmin',
    inStock: true
  }
];

// Subcategories
const subcategories = [
  { id: 'mountain', name: 'Mountain Bikes', count: 12 },
  { id: 'road', name: 'Road Bikes', count: 15 },
  { id: 'safety', name: 'Safety Gear', count: 22 },
  { id: 'clothing', name: 'Clothing & Shoes', count: 30 },
  { id: 'maintenance', name: 'Maintenance', count: 18 },
  { id: 'accessories', name: 'Accessories', count: 25 },
];

// Brands filter
const brands = [
  { id: 'trek', name: 'Trek', count: 10 },
  { id: 'specialized', name: 'Specialized', count: 8 },
  { id: 'giro', name: 'Giro', count: 12 },
  { id: 'shimano', name: 'Shimano', count: 15 },
  { id: 'garmin', name: 'Garmin', count: 6 },
];

// Price ranges
const priceRanges = [
  { id: '0-10000', name: 'Under PKR 10,000', value: '0-10000' },
  { id: '10000-30000', name: 'PKR 10,000 - 30,000', value: '10000-30000' },
  { id: '30000-80000', name: 'PKR 30,000 - 80,000', value: '30000-80000' },
  { id: '80000', name: 'Over PKR 80,000', value: '80000' },
];

export default function CyclingCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter Logic
  const filteredProducts = cyclingProducts.filter(product => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (max && (product.price < min || product.price > max)) return false;
      if (!max && product.price < min) return false;
    }
    return true;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  return (
    <div className="bg-white">
      {/* Hero Section - Matching Electronics Style */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Cycling</h1>
          <p className="mt-4 text-xl text-amber-100">
            Professional bikes and gear for every trail and road
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {subcategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <Link 
                        href={`/${locale}/categories/cycling/${category.id}`}
                        className="text-gray-600 hover:text-orange-600 text-sm"
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        id={range.id}
                        type="radio"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        checked={selectedPriceRange === range.value}
                        onChange={() => { setSelectedPriceRange(range.value); setCurrentPage(1); }}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <input
                        id={`brand-${brand.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        checked={selectedBrands.includes(brand.name)}
                        onChange={() => handleBrandToggle(brand.name)}
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

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  id="sort"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {/* Product Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {currentProducts.map((product) => (
    <div 
      key={product.id} 
      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
    >
      {/* 1. Fixed Image Aspect Ratio */}
      <div className="aspect-square w-full overflow-hidden bg-gray-200 relative">
        <Link href={`/${locale}/products/${product.id}`} className="block h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:opacity-90 transition-opacity"
          />
        </Link>
        {product.inStock && (
          <span className="absolute top-2 right-2 z-10 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            In Stock
          </span>
        )}
      </div>

      {/* 2. Content Area with Flex Grow */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          <Link href={`/${locale}/products/${product.id}`}>
            {/* 3. Line Clamp ensures titles take up the same space (max 2 lines) */}
            <span className="line-clamp-2 h-10 overflow-hidden">
              {product.name}
            </span>
          </Link>
        </h3>
        
        {/* 4. Price & Button pushed to bottom using mt-auto */}
        <div className="mt-auto">
          <p className="text-xl font-bold text-gray-900">
            PKR {product.price.toLocaleString()}
          </p>
          <div className="mt-4">
            <button
              type="button"
              className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add to cart
            </button>
          </div>
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
                      className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`px-3 py-2 leading-tight border ${
                          currentPage === number
                            ? 'z-10 text-orange-600 bg-orange-50 border-orange-300'
                            : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100'
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
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
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