'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for magazines products
export const magazinesProducts = [
  {
    id: 'national-geographic',
    name: 'National Geographic',
    price: 799,
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Explore the wonders of nature and science',
    brand: 'National Geographic Partners',
    inStock: true
  },
  {
    id: 'the-economist',
    name: 'The Economist',
    price: 699,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Weekly insights on politics and business',
    brand: 'The Economist Group',
    inStock: true
  },
  {
    id: 'wired',
    name: 'Wired',
    price: 549,
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'Latest trends in technology and design',
    brand: 'Condé Nast',
    inStock: true
  },
  {
    id: 'vogue',
    name: 'Vogue',
    price: 649,
    image: 'https://images.unsplash.com/photo-1505252585461-04db1267ae5e?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Fashion, beauty, and lifestyle magazine',
    brand: 'Condé Nast',
    inStock: true
  },
  {
    id: 'gq',
    name: 'GQ',
    price: 599,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Men\'s fashion, style, and culture',
    brand: 'Condé Nast',
    inStock: true
  },
  {
    id: 'forbes',
    name: 'Forbes',
    price: 449,
    image: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Business, investing, and entrepreneurship',
    brand: 'Forbes Media',
    inStock: true
  },
  {
    id: 'smithsonian',
    name: 'Smithsonian Magazine',
    price: 499,
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'History, culture, nature, and human interest',
    brand: 'Smithsonian Institution',
    inStock: true
  },
  {
    id: 'nat-geo-kids',
    name: 'National Geographic Kids',
    price: 399,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Educational magazine for young explorers',
    brand: 'National Geographic Partners',
    inStock: true
  }
];

// Categories for magazines
const categories = [
  { id: 'nature-science', name: 'Nature & Science', count: 24 },
  { id: 'business-finance', name: 'Business & Finance', count: 18 },
  { id: 'technology', name: 'Technology', count: 15 },
  { id: 'fashion-style', name: 'Fashion & Style', count: 22 },
  { id: 'history-culture', name: 'History & Culture', count: 12 },
  { id: 'travel', name: 'Travel', count: 16 },
  { id: 'lifestyle', name: 'Lifestyle', count: 20 },
  { id: 'children', name: 'Children & Education', count: 14 }
];

// Publishers for filter
const publishers = [
  { id: 'natgeo', name: 'National Geographic Partners', count: 10 },
  { id: 'economist', name: 'The Economist Group', count: 8 },
  { id: 'conde', name: 'Condé Nast', count: 7 },
  { id: 'forbes', name: 'Forbes Media', count: 9 },
  { id: 'smithsonian', name: 'Smithsonian Institution', count: 6 },
  { id: 'others', name: 'Other Publishers', count: 5 }
];

// Price ranges in PKR
const priceRanges = [
  { id: '0-400', name: 'Under PKR 400', value: '0-400' },
  { id: '400-600', name: 'PKR 400 - 600', value: '400-600' },
  { id: '600-800', name: 'PKR 600 - 800', value: '600-800' },
  { id: '800', name: 'Over PKR 800', value: '800' },
];

export default function MagazinesCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = magazinesProducts.filter(product => {
    // Filter by publisher
    if (selectedPublishers.length > 0 && !selectedPublishers.includes(product.brand)) {
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

  const handlePublisherToggle = (publisher) => {
    setSelectedPublishers(prev => 
      prev.includes(publisher) 
        ? prev.filter(p => p !== publisher)
        : [...prev, publisher]
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Magazines</h1>
          <p className="mt-4 text-xl text-blue-100">
            Discover the latest issues from your favorite publications
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
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <Link 
                        href={`/${locale}/categories/magazines/${category.id}`}
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
                        onChange={() => handlePriceRangeChange(range.value)}
                      />
                      <label htmlFor={range.id} className="ml-3 text-sm text-gray-600">
                        {range.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publishers */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Publishers</h3>
                <div className="space-y-2">
                  {publishers.map((publisher) => (
                    <div key={publisher.id} className="flex items-center">
                      <input
                        id={`publisher-${publisher.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedPublishers.includes(publisher.name)}
                        onChange={() => handlePublisherToggle(publisher.name)}
                      />
                      <label htmlFor={`publisher-${publisher.id}`} className="ml-3 text-sm text-gray-600">
                        {publisher.name} <span className="text-gray-400">({publisher.count})</span>
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
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} magazines
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                        className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                            ? 'z-10 text-blue-600 bg-blue-50 border-blue-300'
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