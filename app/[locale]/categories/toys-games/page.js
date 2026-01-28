'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for toys and games products
export const toysProducts = [
  {
    id: 'lego-1',
    name: 'LEGO Star Wars Millennium Falcon Building Set',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    brand: 'LEGO',
    inStock: true
  },
  {
    id: 'board-1',
    name: 'Monopoly Classic Board Game for Families',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1610890716170-f3339d1b9644?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    brand: 'Hasbro',
    inStock: true
  },
  {
    id: 'puzzle-1',
    name: 'Ravensburger 1000 Piece Jigsaw Puzzle - Nature Edition',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    brand: 'Ravensburger',
    inStock: true
  },
  {
    id: 'doll-1',
    name: 'Barbie Dreamhouse Playset with Elevator and Pool',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    brand: 'Mattel',
    inStock: true
  },
  {
    id: 'edu-1',
    name: 'Fisher-Price Laugh & Learn Smart Stages Chair',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c5?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    brand: 'Fisher-Price',
    inStock: true
  },
  {
    id: 'brain-1',
    name: 'Official Rubiks Cube 3x3 Puzzle',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1591951425328-48c1fe7179cd?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    brand: 'Rubiks',
    inStock: true
  }
];

// Subcategories
const subcategories = [
  { id: 'building-toys', name: 'Building Toys', count: 42 },
  { id: 'board-games', name: 'Board Games', count: 35 },
  { id: 'puzzles', name: 'Puzzles', count: 28 },
  { id: 'educational', name: 'Educational', count: 20 },
  { id: 'collectibles', name: 'Collectibles', count: 15 },
];

// Brands filter
const brands = [
  { id: 'lego', name: 'LEGO', count: 20 },
  { id: 'hasbro', name: 'Hasbro', count: 15 },
  { id: 'mattel', name: 'Mattel', count: 12 },
  { id: 'fisher-price', name: 'Fisher-Price', count: 10 },
  { id: 'ravensburger', name: 'Ravensburger', count: 8 },
];

// Price ranges
const priceRanges = [
  { id: '0-2000', name: 'Under PKR 2,000', value: '0-2000' },
  { id: '2000-5000', name: 'PKR 2,000 - 5,000', value: '2000-5000' },
  { id: '5000-15000', name: 'PKR 5,000 - 15,000', value: '5000-15000' },
  { id: '15000', name: 'Over PKR 15,000', value: '15000' },
];

export default function ToysGamesCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = toysProducts.filter(product => {
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Toys & Games</h1>
          <p className="mt-4 text-xl text-blue-100">
            Discover a world of fun, learning, and adventure for all ages
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
                        href={`/${locale}/categories/toys-games/${category.id}`}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        id={range.id}
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 rounded-md sm:text-sm"
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

            {/* Product Grid - ALIGNED */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
                  <div className="aspect-square relative w-full overflow-hidden bg-gray-200">
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
                  
                  {/* Content area with alignment logic */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      <Link href={`/${locale}/products/${product.id}`}>
                        {/* h-10 reserves exact space for 2 lines of text */}
                        <span className="line-clamp-2 h-10 overflow-hidden block">
                          {product.name}
                        </span>
                      </Link>
                    </h3>
                    
                    {/* mt-auto pushes the price and button to the bottom of the card */}
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
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`px-3 py-2 leading-tight border ${
                          currentPage === number
                            ? 'z-10 text-blue-600 bg-blue-50 border-blue-300'
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