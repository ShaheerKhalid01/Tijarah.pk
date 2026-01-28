'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for e-books products
export const ebooksProducts = [
  {
    id: 'psychology-of-money',
    name: 'The Psychology of Money',
    price: 1999,
    image: 'https://images.unsplash.com/photo-150784272343-583f20270319?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Timeless lessons on wealth, greed, and happiness',
    brand: 'Morgan Housel',
    inStock: true
  },
  {
    id: 'atomic-habits',
    name: 'Atomic Habits',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Build good habits and break bad ones',
    brand: 'James Clear',
    inStock: true
  },
  {
    id: 'project-hail-mary',
    name: 'Project Hail Mary',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'A lone astronaut must save the earth',
    brand: 'Andy Weir',
    inStock: true
  },
  {
    id: 'midnight-library',
    name: 'The Midnight Library',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4d60?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'A novel about life choices and possibilities',
    brand: 'Matt Haig',
    inStock: true
  },
  {
    id: 'code-breaker',
    name: 'The Code Breaker',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Jennifer Doudna and gene editing',
    brand: 'Walter Isaacson',
    inStock: true
  },
  {
    id: 'four-winds',
    name: 'The Four Winds',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1557804506-669714d2e9d8?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Love, heroism, and hope in hardship',
    brand: 'Kristin Hannah',
    inStock: true
  },
  {
    id: 'dune',
    name: 'Dune',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1507842712202-23ba47a6ba24?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Epic science fiction masterpiece',
    brand: 'Frank Herbert',
    inStock: true
  },
  {
    id: 'sapiens',
    name: 'Sapiens',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'A brief history of humankind',
    brand: 'Yuval Noah Harari',
    inStock: true
  }
];

// Categories for e-books
const categories = [
  { id: 'fiction', name: 'Fiction', count: 24 },
  { id: 'personal-finance', name: 'Personal Finance', count: 18 },
  { id: 'self-help', name: 'Self-Help', count: 15 },
  { id: 'biography', name: 'Biography', count: 22 },
  { id: 'sci-fi', name: 'Science Fiction', count: 12 },
  { id: 'history', name: 'History', count: 16 },
  { id: 'mystery', name: 'Mystery', count: 20 },
  { id: 'romance', name: 'Romance', count: 14 }
];

// Authors for filter
const authors = [
  { id: 'morgan', name: 'Morgan Housel', count: 10 },
  { id: 'james', name: 'James Clear', count: 8 },
  { id: 'andy', name: 'Andy Weir', count: 7 },
  { id: 'matt', name: 'Matt Haig', count: 9 },
  { id: 'walter', name: 'Walter Isaacson', count: 6 },
  { id: 'kristin', name: 'Kristin Hannah', count: 5 }
];

// Price ranges in PKR
const priceRanges = [
  { id: '0-1000', name: 'Under PKR 1,000', value: '0-1000' },
  { id: '1000-1500', name: 'PKR 1,000 - 1,500', value: '1000-1500' },
  { id: '1500-2000', name: 'PKR 1,500 - 2,000', value: '1500-2000' },
  { id: '2000', name: 'Over PKR 2,000', value: '2000' },
];

export default function EBooksCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = ebooksProducts.filter(product => {
    // Filter by author
    if (selectedAuthors.length > 0 && !selectedAuthors.includes(product.brand)) {
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

  const handleAuthorToggle = (author) => {
    setSelectedAuthors(prev => 
      prev.includes(author) 
        ? prev.filter(a => a !== author)
        : [...prev, author]
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">E-Books</h1>
          <p className="mt-4 text-xl text-purple-100">
            Discover thousands of digital books instantly
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
                        href={`/${locale}/categories/ebooks/${category.id}`}
                        className="text-gray-600 hover:text-purple-600 text-sm"
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
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
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

              {/* Authors */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Authors</h3>
                <div className="space-y-2">
                  {authors.map((author) => (
                    <div key={author.id} className="flex items-center">
                      <input
                        id={`author-${author.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={selectedAuthors.includes(author.name)}
                        onChange={() => handleAuthorToggle(author.name)}
                      />
                      <label htmlFor={`author-${author.id}`} className="ml-3 text-sm text-gray-600">
                        {author.name} <span className="text-gray-400">({author.count})</span>
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
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} e-books
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
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
                        className="w-full bg-purple-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
                            ? 'z-10 text-purple-600 bg-purple-50 border-purple-300'
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