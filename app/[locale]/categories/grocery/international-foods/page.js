'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for international foods from your file
export const internationalProducts = [
  {
    id: 1,
    name: 'Authentic Italian Pasta Set - Premium Barilla Selection',
    price: 899,
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c8c0?ixlib=rb-4.0.3&w=400&h=500&fit=crop&q=80',
    rating: 4.7,
    brand: 'Barilla',
    origin: 'Italy',
    inStock: true
  },
  {
    id: 2,
    name: 'Japanese Matcha Green Tea - Ceremonial Grade (100g)',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1582733315328-849a7bb7ef76?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    brand: 'Ito En',
    origin: 'Japan',
    inStock: true
  },
  {
    id: 3,
    name: 'Spanish Extra Virgin Olive Oil - Cold Pressed (500ml)',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbad88c5?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    brand: 'Borges',
    origin: 'Spain',
    inStock: true
  },
  {
    id: 4,
    name: 'Mexican Taco Seasoning Mix - Family Size Pack',
    price: 350,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    brand: 'Old El Paso',
    origin: 'Mexico',
    inStock: true
  },
  {
    id: 5,
    name: 'French Camembert Cheese - Traditional Creamy Texture',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    brand: 'President',
    origin: 'France',
    inStock: true
  },
  {
    id: 6,
    name: 'Turkish Delight - Rose & Pistachio Flavor (250g)',
    price: 950,
    image: 'https://images.unsplash.com/photo-1526401485004-46910eea1531?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    brand: 'Hazer Baba',
    origin: 'Turkey',
    inStock: true
  }
];

// Filters
const subcategories = [
  { id: 'italian', name: 'Italian', count: 12 },
  { id: 'japanese', name: 'Japanese', count: 8 },
  { id: 'spanish', name: 'Spanish', count: 5 },
  { id: 'mexican', name: 'Mexican', count: 7 },
  { id: 'french', name: 'French', count: 10 },
];

const brands = [
  { id: 'barilla', name: 'Barilla', count: 6 },
  { id: 'president', name: 'President', count: 4 },
  { id: 'borges', name: 'Borges', count: 3 },
  { id: 'oldelpaso', name: 'Old El Paso', count: 5 },
];

const priceRanges = [
  { id: '0-500', name: 'Under PKR 500', value: '0-500' },
  { id: '500-1000', name: 'PKR 500 - 1000', value: '500-1000' },
  { id: '1000-2000', name: 'PKR 1000 - 2000', value: '1000-2000' },
  { id: '2000', name: 'Over PKR 2000', value: '2000' },
];

export default function InternationalFoodsCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter Logic
  const filteredProducts = internationalProducts.filter(product => {
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

  const handleBrandToggle = (brandName) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
    setCurrentPage(1);
  };

  return (
    <div className="bg-white">
      {/* Hero Section - Matching Electronics Style */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">International Foods</h1>
          <p className="mt-4 text-xl text-blue-100">
            Discover authentic flavors and gourmet specialties from around the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {subcategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <Link href={`/${locale}/categories/international/${category.id}`} className="text-gray-600 hover:text-blue-600 text-sm">
                        {category.name}
                      </Link>
                      <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>

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
                      <label htmlFor={range.id} className="ml-3 text-sm text-gray-600">{range.name}</label>
                    </div>
                  ))}
                </div>
              </div>

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
                      <label htmlFor={`brand-${brand.id}`} className="ml-3 text-sm text-gray-600">{brand.name} <span className="text-gray-400">({brand.count})</span></label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  id="sort"
                  className="pl-3 pr-10 py-2 border-gray-300 focus:ring-blue-500 rounded-md sm:text-sm"
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
                    <span className="absolute top-2 left-2 z-10 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {product.origin}
                    </span>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      <Link href={`/${locale}/products/${product.id}`}>
                        <span className="line-clamp-2 h-10 overflow-hidden block">
                          {product.name}
                        </span>
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">{product.brand}</p>
                    
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
                      className="px-3 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`px-3 py-2 border ${currentPage === number ? 'z-10 text-blue-600 bg-blue-50 border-blue-300' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100'}`}
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