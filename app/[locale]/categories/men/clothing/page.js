'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';

// Subcategories for men's clothing
const subcategories = [
  { id: 't-shirts', name: 'T-Shirts' },
  { id: 'shirts', name: 'Shirts' },
  { id: 'pants', name: 'Pants' },
  { id: 'jeans', name: 'Jeans' },
  { id: 'jackets', name: 'Jackets & Coats' },
  { id: 'activewear', name: 'Activewear' },
  { id: 'suits', name: 'Suits & Blazers' },
  { id: 'underwear', name: 'Underwear & Socks' }
];

// Price ranges for filters
const priceRanges = [
  { id: '0-1000', name: 'Under PKR 1,000', value: '0-1000' },
  { id: '1000-3000', name: 'PKR 1,000 - 3,000', value: '1000-3000' },
  { id: '3000-5000', name: 'PKR 3,000 - 5,000', value: '3000-5000' },
  { id: '5000-10000', name: 'PKR 5,000 - 10,000', value: '5000-10000' },
  { id: '10000', name: 'Over PKR 10,000', value: '10000' },
];

// Sizes
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

// Mock data for men's clothing
const clothingItems = [
  {
    id: 'classic-white-tshirt',
    name: 'Classic White T-Shirt',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Premium quality cotton t-shirt for everyday wear',
    brand: 'BasicWear',
    category: 't-shirts',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Gray'],
    specs: {
      material: '100% Cotton',
      fit: 'Regular',
      care: 'Machine wash cold, tumble dry low'
    }
  },
  {
    id: 'slim-fit-jeans',
    name: 'Slim Fit Jeans',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Comfortable slim fit jeans with stretch technology',
    brand: 'DenimCo',
    category: 'jeans',
    inStock: true,
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Blue', 'Black'],
    specs: {
      material: '98% Cotton, 2% Elastane',
      fit: 'Slim',
      care: 'Machine wash cold, hang to dry'
    }
  },
  {
    id: 'formal-dress-shirt',
    name: 'Formal Dress Shirt',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Classic fit dress shirt for formal occasions',
    brand: 'EliteWear',
    category: 'shirts',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue'],
    specs: {
      material: '100% Cotton',
      fit: 'Classic',
      care: 'Dry clean only'
    }
  },
  {
    id: 'hooded-jacket',
    name: 'Hooded Jacket',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1551028719-00167d6402af?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Water-resistant hooded jacket for all seasons',
    brand: 'OutdoorGear',
    category: 'jackets',
    inStock: true,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Olive'],
    specs: {
      material: 'Polyester with water-resistant coating',
      fit: 'Regular',
      care: 'Spot clean only'
    }
  },
  {
    id: 'chino-pants',
    name: 'Classic Chino Pants',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60',
    rating: 4.4,
    description: 'Versatile chino pants for casual and smart casual looks',
    brand: 'CasualWear',
    category: 'pants',
    inStock: true,
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Khaki', 'Navy', 'Gray'],
    specs: {
      material: '100% Cotton',
      fit: 'Slim Straight',
      care: 'Machine wash cold, tumble dry low'
    }
  },
  {
    id: 'suit-blazer',
    name: 'Slim Fit Suit Blazer',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e4?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'Elegant slim fit blazer for formal occasions',
    brand: 'EliteWear',
    category: 'suits',
    inStock: true,
    sizes: ['38R', '40R', '42R', '44R', '46R'],
    colors: ['Navy', 'Charcoal', 'Black'],
    specs: {
      material: 'Wool Blend',
      fit: 'Slim',
      care: 'Dry clean only'
    }
  },
  {
    id: 'sports-shorts',
    name: 'Training Shorts',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1600689482726-e043369bfe03?w=500&auto=format&fit=crop&q=60',
    rating: 4.3,
    description: 'Lightweight and breathable training shorts',
    brand: 'ActivePro',
    category: 'activewear',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Gray'],
    specs: {
      material: 'Polyester/Spandex blend',
      fit: 'Regular',
      care: 'Machine wash cold, tumble dry low'
    }
  },
  {
    id: 'cotton-boxers',
    name: 'Cotton Boxer Briefs (3-Pack)',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1594938292096-6bb3baf866a8?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Comfortable cotton boxer briefs multipack',
    brand: 'BasicWear',
    category: 'underwear',
    inStock: true,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Assorted'],
    specs: {
      material: '100% Cotton',
      fit: 'Regular',
      care: 'Machine wash warm, tumble dry low'
    }
  }
];

const MensClothingPage = () => {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Get unique brands from clothing items
  const brands = [...new Set(clothingItems.map(item => item.brand))];

  // Filter products based on selected filters
  const filteredProducts = clothingItems.filter(item => {
    // Filter by brand
    if (selectedBrands.length > 0 && !selectedBrands.includes(item.brand)) {
      return false;
    }
    
    // Filter by price range
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (max && (item.price < min || item.price > max)) {
        return false;
      }
      if (!max && item.price < min) {
        return false;
      }
    }
    
    // Filter by size
    if (selectedSizes.length > 0 && !selectedSizes.some(size => item.sizes.includes(size))) {
      return false;
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
      default:
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

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRange('');
    setSelectedSizes([]);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Men's Clothing</h1>
          <p className="mt-4 text-xl text-blue-100">
            Discover the latest trends in men's fashion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="space-y-6">
              {/* Clear Filters Button */}
              {(selectedBrands.length > 0 || selectedPriceRange || selectedSizes.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 text-left"
                >
                  Clear all filters
                </button>
              )}

              {/* Categories */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {subcategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <Link 
                        href={`/${locale}/categories/men/clothing/${category.id}`}
                        className="text-gray-600 hover:text-blue-600 text-sm"
                      >
                        {category.name}
                      </Link>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {clothingItems.filter(item => item.category === category.id).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        id={`brand-${brand}`}
                        name={`brand-${brand}`}
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-gray-600">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        selectedSizes.includes(size)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        id={`price-${range.id}`}
                        name="price-range"
                        type="radio"
                        checked={selectedPriceRange === range.value}
                        onChange={() => handlePriceRangeChange(range.value)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-gray-600">
                        {range.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastProduct, sortedProducts.length)}
                </span>{' '}
                of <span className="font-medium">{sortedProducts.length}</span> results
              </p>
              
              <div className="flex items-center">
                <label htmlFor="sort-by" className="text-sm text-gray-600 mr-2 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort-by"
                  name="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((item) => (
                  <div key={item.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={400}
                        className="h-full w-full object-cover object-center group-hover:opacity-90"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <svg
                              key={rating}
                              className={`h-4 w-4 ${
                                item.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-xs text-gray-500">({item.rating})</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Available in:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.sizes.slice(0, 4).map((size) => (
                            <span key={size} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                              {size}
                            </span>
                          ))}
                          {item.sizes.length > 4 && (
                            <span className="text-xs text-gray-500">+{item.sizes.length - 4} more</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-lg font-medium text-gray-900">
                          PKR {item.price.toLocaleString()}
                        </p>
                        <button className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors">
                          <FiShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastProduct, sortedProducts.length)}
                      </span>{' '}
                      of <span className="font-medium">{sortedProducts.length}</span> results
                    </p>
                  </div>
                  
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MensClothingPage;
