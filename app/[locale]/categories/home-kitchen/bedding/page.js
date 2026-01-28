'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for bedding products
export const beddingProducts = [
  {
    id: 'nishat-egyptian-cotton',
    name: 'Egyptian Cotton Bed Sheet Set',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1601657686229-9542ca0ea6cf?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Premium 100% Egyptian cotton bed sheet set with 800 thread count',
    brand: 'Nishat Linen',
    inStock: true
  },
  {
    id: 'alkaram-duvet-cover',
    name: 'Luxury Duvet Cover Set',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1642407864986-2e1d3d0b0c6e?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Luxury duvet cover set with matching pillow shams',
    brand: 'Al-Karam',
    inStock: true
  },
  {
    id: 'gul-ahmed-comforter',
    name: 'All-Season Down Alternative Comforter',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1616628188540-03607e974e0c?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Hypoallergenic down alternative comforter for all seasons',
    brand: 'Gul Ahmed',
    inStock: true
  },
  {
    id: 'chenone-memory-foam-pillow',
    name: 'Memory Foam Pillow',
    price: 5499,
    image: 'https://images.unsplash.com/photo-1595925008288-3d6862764c66?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Therapeutic memory foam pillow for neck support',
    brand: 'ChenOne',
    inStock: true
  },
  {
    id: 'outfitters-quilt-set',
    name: 'Reversible Quilt Set',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=600&auto=format&fit=crop&q=60',
    rating: 4.4,
    description: 'Reversible quilt set with 2-tone design',
    brand: 'Outfitters',
    inStock: true
  },
  {
    id: 'bonanza-mattress-protector',
    name: 'Waterproof Mattress Protector',
    price: 6999,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Premium waterproof and breathable mattress protector',
    brand: 'Bonanza',
    inStock: true
  },
  {
    id: 'lime-light-weighted-blanket',
    name: 'Weighted Blanket',
    price: 21999,
    image: 'https://images.unsplash.com/photo-1583847268964-28c403c1c4ed?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'Therapeutic weighted blanket for better sleep',
    brand: 'LimeLight',
    inStock: true
  },
  {
    id: 'sana-safinaz-bedspread',
    name: 'Embroidered Bedspread Set',
    price: 34999,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Luxurious embroidered bedspread set with shams',
    brand: 'Sana Safinaz',
    inStock: true
  }
];

// Subcategories for bedding
const subcategories = [
  { id: 'bed-sheets', name: 'Bed Sheets', count: 24 },
  { id: 'duvet-covers', name: 'Duvet Covers', count: 18 },
  { id: 'comforters', name: 'Comforters', count: 15 },
  { id: 'pillows', name: 'Pillows', count: 22 },
  { id: 'mattress-protectors', name: 'Mattress Protectors', count: 12 },
  { id: 'blankets', name: 'Blankets', count: 16 },
  { id: 'quilt-sets', name: 'Quilt Sets', count: 20 },
  { id: 'bedspreads', name: 'Bedspreads', count: 14 }
];

// Brands for filter
const brands = [
  { id: 'nishat', name: 'Nishat Linen', count: 10 },
  { id: 'alkaram', name: 'Al-Karam', count: 8 },
  { id: 'gulahmed', name: 'Gul Ahmed', count: 7 },
  { id: 'chenone', name: 'ChenOne', count: 9 },
  { id: 'outfitters', name: 'Outfitters', count: 6 },
  { id: 'bonanza', name: 'Bonanza', count: 5 }
];

// Price ranges in PKR
const priceRanges = [
  { id: '0-5000', name: 'Under PKR 5,000', value: '0-5000' },
  { id: '5000-15000', name: 'PKR 5,000 - 15,000', value: '5000-15000' },
  { id: '15000-30000', name: 'PKR 15,000 - 30,000', value: '15000-30000' },
  { id: '30000', name: 'Over PKR 30,000', value: '30000' },
];

export default function BeddingCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = beddingProducts.filter(product => {
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
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Bedding</h1>
          <p className="mt-4 text-xl text-indigo-100">
            Premium bedding for ultimate comfort and sleep
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
                        href={`/${locale}/categories/bedding/${category.id}`}
                        className="text-gray-600 hover:text-indigo-600 text-sm"
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
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                        className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                            ? 'z-10 text-indigo-600 bg-indigo-50 border-indigo-300'
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