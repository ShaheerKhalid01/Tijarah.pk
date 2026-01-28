'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for kitchen appliances
export const kitchenAppliancesProducts = [
  {
    id: 'dawlance-fridge',
    name: 'Dawlance Inverter Refrigerator',
    price: 149999,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d9338c77?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: '25 cu.ft Inverter Refrigerator with Frost Free Technology',
    brand: 'Dawlance',
    inStock: true
  },
  {
    id: 'haier-microwave',
    name: 'Haier Convection Microwave Oven',
    price: 34999,
    image: 'https://images.unsplash.com/photo-1614152328389-34145fad84ce?w=600&auto=format&fit=crop&q=60',
    rating: 4.4,
    description: '30L Convection Microwave Oven with Grill',
    brand: 'Haier',
    inStock: true
  },
  {
    id: 'kenwood-mixer',
    name: 'Kenwood Stand Mixer',
    price: 59999,
    image: 'https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Professional Stand Mixer with 6.7L Bowl',
    brand: 'Kenwood',
    inStock: true
  },
  {
    id: 'pel-washing-machine',
    name: 'PEL Automatic Washing Machine',
    price: 79999,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Front Load Washing Machine with 8kg Capacity',
    brand: 'Pel',
    inStock: true
  },
  {
    id: 'orient-dishwasher',
    name: 'Orient Dishwasher',
    price: 89999,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbbc50d737?w=600&auto=format&fit=crop&q=60',
    rating: 4.3,
    description: '12 Place Settings Dishwasher with Drying Function',
    brand: 'Orient',
    inStock: true
  },
  {
    id: 'panasonic-oven',
    name: 'Panasonic Microwave Oven',
    price: 44999,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: '25L Microwave Oven with Multiple Cooking Functions',
    brand: 'Panasonic',
    inStock: true
  },
  {
    id: 'philips-air-fryer',
    name: 'Philips Air Fryer',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: '4.1L Air Fryer with Rapid Air Technology',
    brand: 'Philips',
    inStock: true
  },
  {
    id: 'westpoint-cooker',
    name: 'Westpoint Pressure Cooker',
    price: 14999,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3132?w=600&auto=format&fit=crop&q=60',
    rating: 4.4,
    description: 'Stainless Steel Pressure Cooker with 8L Capacity',
    brand: 'Westpoint',
    inStock: true
  }
];

// Subcategories for kitchen appliances
const subcategories = [
  { id: 'refrigerators', name: 'Refrigerators', count: 24 },
  { id: 'cooking', name: 'Cooking Appliances', count: 18 },
  { id: 'coffee', name: 'Coffee Makers', count: 15 },
  { id: 'blenders', name: 'Blenders & Mixers', count: 22 },
  { id: 'microwaves', name: 'Microwaves', count: 12 },
  { id: 'dishwashers', name: 'Dishwashers', count: 8 },
  { id: 'ovens', name: 'Ovens & Toasters', count: 16 },
  { id: 'small-appliances', name: 'Small Appliances', count: 20 }
];

// Brands for filter
const brands = [
  { id: 'dawlance', name: 'Dawlance', count: 10 },
  { id: 'haier', name: 'Haier', count: 8 },
  { id: 'pel', name: 'Pel', count: 7 },
  { id: 'orient', name: 'Orient', count: 9 },
  { id: 'kenwood', name: 'Kenwood', count: 6 },
  { id: 'panasonic', name: 'Panasonic', count: 5 }
];

// Price ranges for filters
const priceRanges = [
  { id: '0-20000', name: 'Under PKR 20,000', value: '0-20000' },
  { id: '20000-50000', name: 'PKR 20,000 - 50,000', value: '20000-50000' },
  { id: '50000-100000', name: 'PKR 50,000 - 100,000', value: '50000-100000' },
  { id: '100000-200000', name: 'PKR 100,000 - 200,000', value: '100000-200000' },
  { id: '200000', name: 'Over PKR 200,000', value: '200000' },
];

export default function KitchenAppliancesCategory() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = kitchenAppliancesProducts.filter(product => {
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
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Kitchen Appliances</h1>
          <p className="mt-4 text-xl text-orange-100">
            Essential appliances for your modern kitchen
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
                        href={`/${locale}/categories/kitchen-appliances/${category.id}`}
                        className="text-gray-600 hover:text-orange-600 text-sm"
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
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
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
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
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
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
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
                        className="w-full bg-orange-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
                            ? 'z-10 text-orange-600 bg-orange-50 border-orange-300'
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