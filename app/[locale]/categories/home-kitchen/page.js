'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for home & kitchen products
export const homeKitchenProducts = [
  {
    id: 'deluxe-blender',
    name: 'Deluxe Kitchen Blender',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a0be6070?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Powerful blender for smoothies and soups',
    brand: 'KitchenPro',
    inStock: true
  },
  {
    id: 'coffee-maker',
    name: 'Automatic Coffee Maker',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1559056169-641a0ac8b3f3?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Programmable coffee maker for perfect mornings',
    brand: 'BrewMaster',
    inStock: true
  },
  {
    id: 'dining-table-set',
    name: 'Modern Dining Table Set',
    price: 34999,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Elegant dining set for 6 people',
    brand: 'FurniturePlus',
    inStock: true
  },
  {
    id: 'led-pendant-light',
    name: 'LED Pendant Light',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1565636192335-14f6b7ce9f60?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Modern LED pendant light for kitchen',
    brand: 'LightWorks',
    inStock: true
  },
  {
    id: 'luxury-bedding-set',
    name: 'Luxury Bedding Set',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1579656905535-cfe1ba36ec31?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'Premium Egyptian cotton bedding',
    brand: 'ComfortHome',
    inStock: true
  },
  {
    id: 'food-storage-set',
    name: 'Airtight Food Storage Containers',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1578507065211-a9c0b1c51201?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Set of 5 airtight containers for kitchen organization',
    brand: 'StoragePro',
    inStock: true
  },
  {
    id: 'wall-mirror-decor',
    name: 'Decorative Wall Mirror',
    price: 6999,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Beautiful decorative wall mirror for living room',
    brand: 'DecorArt',
    inStock: true
  },
  {
    id: 'robot-vacuum',
    name: 'Smart Robot Vacuum',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Intelligent robot vacuum with app control',
    brand: 'SmartHome',
    inStock: true
  }
];

// Subcategories for home & kitchen
const subcategories = [
  { id: 'kitchen-appliances', name: 'Kitchen Appliances', count: 32 },
  { id: 'furniture', name: 'Furniture', count: 28 },
  { id: 'home-decor', name: 'Home Decor', count: 35 },
  { id: 'lighting', name: 'Lighting', count: 18 },
  { id: 'bedding', name: 'Bedding', count: 22 },
  { id: 'storage', name: 'Storage & Organization', count: 25 },
  { id: 'cookware', name: 'Cookware & Dining', count: 20 },
  { id: 'cleaning', name: 'Cleaning Supplies', count: 15 }
];

// Brands filter
const brands = [
  { id: 'kitchenpro', name: 'KitchenPro', count: 10 },
  { id: 'brewmaster', name: 'BrewMaster', count: 8 },
  { id: 'furnitureplus', name: 'FurniturePlus', count: 12 },
  { id: 'lightworks', name: 'LightWorks', count: 9 },
  { id: 'comforthome', name: 'ComfortHome', count: 11 },
  { id: 'smarthome', name: 'SmartHome', count: 10 }
];

// Price ranges in PKR
const priceRanges = [
  { id: '0-5000', name: 'Under PKR 5,000', value: '0-5000' },
  { id: '5000-15000', name: 'PKR 5,000 - 15,000', value: '5000-15000' },
  { id: '15000-30000', name: 'PKR 15,000 - 30,000', value: '15000-30000' },
  { id: '30000-50000', name: 'PKR 30,000 - 50,000', value: '30000-50000' },
  { id: '50000', name: 'Over PKR 50,000', value: '50000' },
];

export default function HomeKitchenCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = homeKitchenProducts.filter(product => {
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
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Home & Kitchen</h1>
          <p className="mt-4 text-xl text-teal-100">
            Transform your living space with our curated collection
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
                        href={`/${locale}/categories/home-kitchen/${category.id}`}
                        className="text-gray-600 hover:text-teal-600 text-sm"
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
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
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
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
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
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
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
  {/* Product Image Section - Fixed height container */}
  <div className="relative h-48 overflow-hidden bg-gray-200">
    <Link href={`/${locale}/products/${product.id}`} className="block h-full">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
      />
    </Link>
    {product.inStock && (
      <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
        In Stock
      </span>
    )}
  </div>
  
  {/* Product Info Section - Flex column with flex-grow */}
  <div className="p-4 flex flex-col flex-grow">
    {/* Title with fixed height */}
    <div className="h-12 mb-2">
      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
        <Link href={`/${locale}/products/${product.id}`}>
          <span aria-hidden="true" className="absolute inset-0" />
          {product.name}
        </Link>
      </h3>
    </div>
    
    {/* Price - Fixed height */}
    <div className="h-10 flex items-center">
      <p className="text-xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</p>
    </div>
    
    {/* Add to Cart Button - Fixed at bottom */}
    <div className="mt-auto pt-3">
      <button
        type="button"
        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
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
                            ? 'z-10 text-teal-600 bg-teal-50 border-teal-300'
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