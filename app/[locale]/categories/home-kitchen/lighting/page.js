'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for lighting products
export const lightingProducts = [
  {
    id: 'philips-hue-white',
    name: 'Philips Hue White Smart Bulb',
    price: 5499,
    image: 'https://images.unsplash.com/photo-1513506003900-6f5e9c3f9c8f?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Smart LED bulb with adjustable white light, works with Alexa and Google Assistant',
    brand: 'Philips',
    inStock: true
  },
  {
    id: 'osram-ceiling-light',
    name: 'Osram LED Panel Light',
    price: 12499,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Slim LED panel light for modern ceiling installation',
    brand: 'Osram',
    inStock: true
  },
  {
    id: 'orient-chandelier',
    name: 'Orient Crystal Chandelier',
    price: 45999,
    image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Elegant crystal chandelier for living room or dining area',
    brand: 'Orient',
    inStock: true
  },
  {
    id: 'havells-floor-lamp',
    name: 'Havells Adjustable Floor Lamp',
    price: 17999,
    image: 'https://images.unsplash.com/photo-1531842771740-9e0c6e6d7ab9?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Modern adjustable floor lamp with touch control',
    brand: 'Havells',
    inStock: true
  },
  {
    id: 'panasonic-led-bulb',
    name: 'Panasonic LED Bulb Pack',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=60',
    rating: 4.4,
    description: 'Energy efficient LED bulbs with long lifespan',
    brand: 'Panasonic',
    inStock: true
  },
  {
    id: 'crystal-pendant-light',
    name: 'Modern Crystal Pendant Light',
    price: 28999,
    image: 'https://images.unsplash.com/photo-1513506003901-69b44f4e96f3?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'Elegant crystal pendant light for dining table or kitchen island',
    brand: 'Crystal Lighting',
    inStock: true
  },
  {
    id: 'noon-smart-bulb',
    name: 'Noon RGB Smart Bulb',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1564709443086-5886f211163a?w=600&auto=format&fit=crop&q=60',
    rating: 4.3,
    description: 'Full color smart bulb with app control',
    brand: 'Noon',
    inStock: true
  },
  {
    id: 'ge-outdoor-floodlight',
    name: 'GE LED Floodlight',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1520333344046-a6145dccd581?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'High-power LED floodlight for outdoor security',
    brand: 'GE Lighting',
    inStock: true
  }
];

// Subcategories for lighting
const subcategories = [
  { id: 'ceiling-lights', name: 'Ceiling Lights', count: 24 },
  { id: 'wall-lights', name: 'Wall Lights', count: 18 },
  { id: 'table-lamps', name: 'Table Lamps', count: 15 },
  { id: 'floor-lamps', name: 'Floor Lamps', count: 22 },
  { id: 'pendant-lights', name: 'Pendant Lights', count: 12 },
  { id: 'chandeliers', name: 'Chandeliers', count: 16 },
  { id: 'spotlights', name: 'Spotlights', count: 20 },
  { id: 'outdoor-lighting', name: 'Outdoor Lighting', count: 14 }
];

// Brands for filter
const brands = [
  { id: 'philips', name: 'Philips', count: 10 },
  { id: 'osram', name: 'Osram', count: 8 },
  { id: 'panasonic', name: 'Panasonic', count: 7 },
  { id: 'ge', name: 'GE Lighting', count: 9 },
  { id: 'havells', name: 'Havells', count: 6 },
  { id: 'orient', name: 'Orient', count: 5 }
];

// Price ranges in PKR
const priceRanges = [
  { id: '0-5000', name: 'Under PKR 5,000', value: '0-5000' },
  { id: '5000-20000', name: 'PKR 5,000 - 20,000', value: '5000-20000' },
  { id: '20000-50000', name: 'PKR 20,000 - 50,000', value: '20000-50000' },
  { id: '50000', name: 'Over PKR 50,000', value: '50000' },
];

export default function LightingCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = lightingProducts.filter(product => {
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
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Lighting</h1>
          <p className="mt-4 text-xl text-yellow-100">
            Brighten your space with premium lighting solutions
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
                        href={`/${locale}/categories/lighting/${category.id}`}
                        className="text-gray-600 hover:text-yellow-600 text-sm"
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
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <input
                        id={`brand-${brand.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
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

          {/* Products */}
          <div className="flex-1">
            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
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
                        In Stock
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
                      <Link href={`/${locale}/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</p>
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        className="w-full bg-yellow-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        Add to cart
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
                      <span className="sr-only">Previous</span>
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
                            ? 'z-10 text-yellow-600 bg-yellow-50 border-yellow-300'
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
                      <span className="sr-only">Next</span>
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