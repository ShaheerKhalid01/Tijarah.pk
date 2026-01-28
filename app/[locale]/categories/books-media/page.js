'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for books & media products
export const booksMediaProducts = [
  {
    id: 'fiction-novel-1',
    name: 'The Midnight Library',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'A captivating novel about life choices and possibilities',
    brand: 'Penguin Books',
    inStock: true
  },
  {
    id: 'fiction-novel-2',
    name: 'Daisy Jones & The Six',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b6034d21?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'A gripping tale of ambition, fame, and music',
    brand: 'Crown Publishing',
    inStock: true
  },
  {
    id: 'nonfiction-biography-1',
    name: 'Becoming: Michelle Obama',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0a?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'An inspiring biography and memoir',
    brand: 'Viking Press',
    inStock: true
  },
  {
    id: 'audiobook-1',
    name: 'Atomic Habits Audiobook',
    price: 999,
    image: 'https://images.unsplash.com/photo-1505740420748-22eaa385e9fa?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'Transform your habits and improve your life',
    brand: 'Audible',
    inStock: true
  },
  {
    id: 'movie-1',
    name: 'Inception 4K Ultra HD',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Mind-bending sci-fi masterpiece in 4K',
    brand: 'Warner Bros',
    inStock: true
  },
  {
    id: 'music-album-1',
    name: 'Taylor Swift: Midnights Album',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Latest album from Taylor Swift',
    brand: 'Republic Records',
    inStock: true
  },
  {
    id: 'fiction-novel-3',
    name: 'It Ends with Us',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'A powerful story about breaking cycles',
    brand: 'Atria Books',
    inStock: true
  },
  {
    id: 'academic-textbook-1',
    name: 'Introduction to Psychology',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=60',
    rating: 4.4,
    description: 'Comprehensive psychology textbook',
    brand: 'Pearson Education',
    inStock: true
  }
];

// Categories for books & media
const categories = [
  { id: 'fiction', name: 'Fiction Books', count: 24 },
  { id: 'non-fiction', name: 'Non-Fiction', count: 18 },
  { id: 'academic', name: 'Academic & Textbooks', count: 15 },
  { id: 'audiobooks', name: 'Audiobooks', count: 22 },
  { id: 'movies', name: 'Movies & TV Shows', count: 12 },
  { id: 'music', name: 'Music & Audio', count: 16 },
  { id: 'manga', name: 'Manga & Comics', count: 20 },
  { id: 'magazines', name: 'Magazines', count: 14 }
];

// Brands for filter
const brands = [
  { id: 'penguin', name: 'Penguin Books', count: 10 },
  { id: 'crown', name: 'Crown Publishing', count: 8 },
  { id: 'viking', name: 'Viking Press', count: 7 },
  { id: 'audible', name: 'Audible', count: 9 },
  { id: 'warner', name: 'Warner Bros', count: 6 },
  { id: 'republic', name: 'Republic Records', count: 5 }
];

// Price ranges in PKR
const priceRanges = [
  { id: '0-1000', name: 'Under PKR 1,000', value: '0-1000' },
  { id: '1000-3000', name: 'PKR 1,000 - 3,000', value: '1000-3000' },
  { id: '3000-5000', name: 'PKR 3,000 - 5,000', value: '3000-5000' },
  { id: '5000', name: 'Over PKR 5,000', value: '5000' },
];

export default function BooksMediaCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = booksMediaProducts.filter(product => {
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Books & Media</h1>
          <p className="mt-4 text-xl text-indigo-100">
            Discover your next great read, watch, or listen
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
                        href={`/${locale}/categories/books-media/${category.id}`}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Publishers & Labels</h3>
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