'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for bags
export const bagsProducts = [
  {
    id: 'gucci-gg-marmont',
    name: 'GG Marmont Matelassé Mini Bag',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'Luxury matelassé leather mini bag with GG logo',
    brand: 'Gucci',
    inStock: true,
    specs: {
      dimensions: '22 x 13 x 6 cm',
      closure: 'Flap with magnetic snap',
      material: 'Matelassé leather',
      color: 'Black, Beige, Pink'
    }
  },
  {
    id: 'mk-crossbody',
    name: 'Michael Kors Jet Set Travel Crossbody',
    price: 34999,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Chic crossbody bag with adjustable strap',
    brand: 'Michael Kors',
    inStock: true,
    specs: {
      dimensions: '20 x 15 x 5 cm',
      closure: 'Zipper',
      material: 'Saffiano leather',
      color: 'Black, Blush, Navy'
    }
  },
  {
    id: 'fossil-tote',
    name: 'Fossil Women\'s Sydney Tote',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1591561954555-607968c141ab?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Spacious tote bag with multiple compartments',
    brand: 'Fossil',
    inStock: true,
    specs: {
      dimensions: '33 x 36 x 15 cm',
      closure: 'Zipper',
      material: 'Genuine leather',
      color: 'Brown, Black, Tan'
    }
  },
  {
    id: 'charles-keith-satchel',
    name: 'Charles & Keith Structured Satchel',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Modern structured satchel with dual handles',
    brand: 'Charles & Keith',
    inStock: true,
    specs: {
      dimensions: '28 x 22 x 10 cm',
      closure: 'Magnetic snap',
      material: 'Faux leather',
      color: 'Black, Burgundy, White'
    }
  },
  {
    id: 'nine-west-clutch',
    name: 'Nine West Elegant Clutch',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60',
    rating: 4.4,
    description: 'Sleek evening clutch with shoulder strap',
    brand: 'Nine West',
    inStock: true,
    specs: {
      dimensions: '25 x 15 x 5 cm',
      closure: 'Snap closure',
      material: 'Faux leather',
      color: 'Black, Gold, Silver'
    }
  },
  {
    id: 'aldo-backpack',
    name: 'Aldo Travel Backpack',
    price: 16999,
    image: 'https://images.unsplash.com/photo-1591561954555-607968c141ab?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Versatile backpack with USB charging port',
    brand: 'Aldo',
    inStock: true,
    specs: {
      dimensions: '30 x 18 x 45 cm',
      closure: 'Zipper',
      material: 'Polyester',
      color: 'Black, Navy, Gray'
    }
  },
  {
    id: 'sapphire-wallet',
    name: 'Sapphire Women\'s Leather Wallet',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=60',
    rating: 4.3,
    description: 'Premium leather wallet with RFID protection',
    brand: 'Sapphire',
    inStock: true,
    specs: {
      dimensions: '19 x 10 x 2 cm',
      closure: 'Snap',
      material: 'Genuine leather',
      color: 'Black, Brown, Cognac'
    }
  }
];

// Subcategories for bags
const subcategories = [
  { id: 'handbags', name: 'Handbags', count: 28 },
  { id: 'backpacks', name: 'Backpacks', count: 18 },
  { id: 'totes', name: 'Tote Bags', count: 22 },
  { id: 'clutches', name: 'Clutches', count: 15 },
  { id: 'crossbody', name: 'Crossbody Bags', count: 20 },
  { id: 'shoulder', name: 'Shoulder Bags', count: 16 },
  { id: 'satchels', name: 'Satchels', count: 12 },
  { id: 'wallets', name: 'Wallets & Cardholders', count: 25 }
];

// Brands filter
const brands = [
  { id: 'gucci', name: 'Gucci', count: 10 },
  { id: 'mk', name: 'Michael Kors', count: 12 },
  { id: 'fossil', name: 'Fossil', count: 9 },
  { id: 'charles-keith', name: 'Charles & Keith', count: 11 },
  { id: 'nine-west', name: 'Nine West', count: 8 },
  { id: 'aldo', name: 'Aldo', count: 9 }
];

// Price ranges in PKR
const priceRanges = [
  { id: '0-10000', name: 'Under PKR 10,000', value: '0-10000' },
  { id: '10000-30000', name: 'PKR 10,000 - 30,000', value: '10000-30000' },
  { id: '30000-50000', name: 'PKR 30,000 - 50,000', value: '30000-50000' },
  { id: '50000-100000', name: 'PKR 50,000 - 100,000', value: '50000-100000' },
  { id: '100000', name: 'Over PKR 100,000', value: '100000' },
];

export default function BagsPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = bagsProducts.filter(product => {
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
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Bags & Accessories</h1>
          <p className="mt-4 text-xl text-pink-100">
            Discover stylish bags from luxury brands to everyday essentials
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
                        href={`/${locale}/categories/fashion/bags/${category.id}`}
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
                        name="price-range"
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
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
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
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
                        In Stock
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={`/${locale}/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <svg
                            key={rating}
                            className={`h-4 w-4 ${
                              rating < Math.floor(product.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-xs text-gray-500">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
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
                            ? 'z-10 text-pink-600 bg-pink-50 border-pink-300'
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