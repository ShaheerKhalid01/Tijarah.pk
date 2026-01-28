'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for music products
export const musicProducts = [
  {
    id: 'blinding-lights',
    name: 'Blinding Lights',
    price: 799,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'A stunning collection of hit songs from The Weeknd',
    brand: 'The Weeknd',
    inStock: true
  },
  {
    id: 'midnights',
    name: 'Midnights',
    price: 899,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Taylor Swift\'s latest album exploring the midnight hours',
    brand: 'Taylor Swift',
    inStock: true
  },
  {
    id: 'rumours',
    name: 'Rumours',
    price: 699,
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'A classic masterpiece from Fleetwood Mac',
    brand: 'Fleetwood Mac',
    inStock: true
  },
  {
    id: 'starboy',
    name: 'Starboy',
    price: 749,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'The Weeknd\'s collaboration album with stunning production',
    brand: 'The Weeknd',
    inStock: true
  },
  {
    id: 'thriller',
    name: 'Thriller',
    price: 649,
    image: 'https://images.unsplash.com/photo-1505618346881-b72b27e84530?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'The best-selling album of all time',
    brand: 'Michael Jackson',
    inStock: true
  },
  {
    id: 'abbey-road',
    name: 'Abbey Road',
    price: 549,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'The Beatles\' legendary final recorded album',
    brand: 'The Beatles',
    inStock: true
  },
  {
    id: 'justice',
    name: 'Justice',
    price: 749,
    image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Justin Bieber\'s album with collaborations and personal growth',
    brand: 'Justin Bieber',
    inStock: true
  },
  {
    id: 'purple',
    name: 'Purple',
    price: 599,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'D\'Angelo\'s modern soul masterpiece',
    brand: 'D\'Angelo',
    inStock: true
  }
];

// Categories for music
const categories = [
  { id: 'pop', name: 'Pop', count: 24 },
  { id: 'rock', name: 'Rock', count: 18 },
  { id: 'hip-hop', name: 'Hip-Hop', count: 15 },
  { id: 'r-b', name: 'R&B', count: 22 },
  { id: 'indie', name: 'Indie', count: 12 },
  { id: 'jazz', name: 'Jazz', count: 16 },
  { id: 'electronic', name: 'Electronic', count: 20 },
  { id: 'classical', name: 'Classical', count: 14 }
];

// Artists for filter
const artists = [
  { id: 'weeknd', name: 'The Weeknd', count: 10 },
  { id: 'taylor', name: 'Taylor Swift', count: 8 },
  { id: 'beatles', name: 'The Beatles', count: 7 },
  { id: 'michael', name: 'Michael Jackson', count: 9 },
  { id: 'fleetwood', name: 'Fleetwood Mac', count: 6 },
  { id: 'dangelo', name: 'D\'Angelo', count: 5 }
];

// Price ranges in PKR
const priceRanges = [
  { id: '0-500', name: 'Under PKR 500', value: '0-500' },
  { id: '500-700', name: 'PKR 500 - 700', value: '500-700' },
  { id: '700-900', name: 'PKR 700 - 900', value: '700-900' },
  { id: '900', name: 'Over PKR 900', value: '900' },
];

export default function MusicCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = musicProducts.filter(product => {
    // Filter by artist
    if (selectedArtists.length > 0 && !selectedArtists.includes(product.brand)) {
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

  const handleArtistToggle = (artist) => {
    setSelectedArtists(prev => 
      prev.includes(artist) 
        ? prev.filter(a => a !== artist)
        : [...prev, artist]
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Music</h1>
          <p className="mt-4 text-xl text-purple-100">
            Discover your favorite albums and artists
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
                        href={`/${locale}/categories/music/${category.id}`}
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

              {/* Artists */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Artists</h3>
                <div className="space-y-2">
                  {artists.map((artist) => (
                    <div key={artist.id} className="flex items-center">
                      <input
                        id={`artist-${artist.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={selectedArtists.includes(artist.name)}
                        onChange={() => handleArtistToggle(artist.name)}
                      />
                      <label htmlFor={`artist-${artist.id}`} className="ml-3 text-sm text-gray-600">
                        {artist.name} <span className="text-gray-400">({artist.count})</span>
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
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} albums
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