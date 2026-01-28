'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for building toys (Standardized to match the UI pattern)
export const buildingToysProducts = [
  {
    id: 1,
    name: 'LEGO Classic Large Creative Brick Box - 900 Pieces',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&w=400&h=500&fit=crop&q=80',
    rating: 4.9,
    brand: 'LEGO',
    category: 'LEGO',
    inStock: true
  },
  {
    id: 2,
    name: 'LEGO Architecture Skylines Series - Iconic World Landmarks',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1618705479889-2d84cf6d3eba?ixlib=rb-4.0.3&w=400&h=500&fit=crop&q=80',
    rating: 4.7,
    brand: 'LEGO',
    category: 'LEGO',
    inStock: true
  },
  {
    id: 3,
    name: 'Magnetic Building Blocks Set - 100 Piece 3D Tiles',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?ixlib=rb-4.0.3&w=400&h=500&fit=crop&q=80',
    rating: 4.8,
    brand: 'Magna-Tiles',
    category: 'Magnetic Blocks',
    inStock: true
  },
  {
    id: 4,
    name: "K'NEX Building System Deluxe Set - Rods and Connectors",
    price: 1999,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&w=400&h=500&fit=crop&q=80',
    rating: 4.6,
    brand: "K'NEX",
    category: 'Rod & Connector',
    inStock: true
  },
  {
    id: 5,
    name: 'Wooden Block Building Set - Natural Classic Construction',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1517725360735-f32b91b81423?ixlib=rb-4.0.3&w=400&h=500&fit=crop&q=80',
    rating: 4.7,
    brand: 'Melissa & Doug',
    category: 'Wooden Blocks',
    inStock: true
  },
  {
    id: 6,
    name: 'LEGO Technic Advanced Robotics and Mechanical Kit',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&w=400&h=500&fit=crop&q=80',
    rating: 4.9,
    brand: 'LEGO',
    category: 'LEGO',
    inStock: true
  }
];

// Subcategories
const subcategories = [
  { id: 'lego', name: 'LEGO Sets', count: 24 },
  { id: 'magnetic', name: 'Magnetic Blocks', count: 12 },
  { id: 'wooden', name: 'Wooden Blocks', count: 18 },
  { id: 'stem', name: 'STEM Kits', count: 15 },
  { id: 'stacking', name: 'Stacking Toys', count: 10 },
];

// Brands
const brands = [
  { id: 'lego', name: 'LEGO', count: 15 },
  { id: 'magna', name: 'Magna-Tiles', count: 8 },
  { id: 'knex', name: "K'NEX", count: 6 },
  { id: 'melissa', name: 'Melissa & Doug', count: 12 },
  { id: 'fisher', name: 'Fisher-Price', count: 9 },
];

// Price ranges
const priceRanges = [
  { id: '0-1000', name: 'Under PKR 1,000', value: '0-1000' },
  { id: '1000-2500', name: 'PKR 1,000 - 2,500', value: '1000-2500' },
  { id: '2500-4000', name: 'PKR 2,500 - 4,000', value: '2500-4000' },
  { id: '4000', name: 'Over PKR 4,000', value: '4000' },
];

export default function BuildingToysCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter Logic
  const filteredProducts = buildingToysProducts.filter(product => {
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
      <div className="bg-gradient-to-r from-pink-600 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Building Toys</h1>
          <p className="mt-4 text-xl text-pink-100">
            Discover fun and educational building sets for all ages
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
                        href={`/${locale}/categories/building-toys/${category.id}`}
                        className="text-gray-600 hover:text-pink-600 text-sm"
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
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
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
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
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
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 rounded-md sm:text-sm"
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
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      <Link href={`/${locale}/products/${product.id}`}>
                        {/* h-10 ensures 1-line and 2-line titles take up the same space */}
                        <span className="line-clamp-2 h-10 overflow-hidden block">
                          {product.name}
                        </span>
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">{product.brand}</p>
                    
                    {/* mt-auto pushes the price and button to the bottom of the card */}
                    <div className="mt-auto">
                      <p className="text-xl font-bold text-gray-900">
                        PKR {product.price.toLocaleString()}
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="w-full bg-pink-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
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
                      className="px-3 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`px-3 py-2 border ${currentPage === number ? 'z-10 text-pink-600 bg-pink-50 border-pink-300' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100'}`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50"
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