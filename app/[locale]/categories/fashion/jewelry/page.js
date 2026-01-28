'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for jewelry
export const jewelryProducts = [
  {
    id: 'diamond-solitaire-ring',
    name: 'Diamond Solitaire Ring',
    price: 45999,
    image: 'https://images.unsplash.com/photo-1603974379129-d1a993dc6a9c?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Elegant 14K white gold solitaire ring with a brilliant cut diamond',
    brand: 'DiamondLux',
    inStock: true,
    specs: {
      material: '14K Gold',
      stone: 'Diamond (0.5ct)',
      setting: 'Prong',
      metalColor: 'White Gold, Yellow Gold, Rose Gold'
    }
  },
  {
    id: 'pearl-necklace',
    name: 'Pearl Strand Necklace',
    price: 28999,
    image: 'https://images.unsplash.com/photo-1611591437281-4608b3885ce4?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Classic 18-inch freshwater pearl necklace with sterling silver clasp',
    brand: 'PearlElegance',
    inStock: true,
    specs: {
      material: 'Freshwater Pearls, Sterling Silver',
      length: '18 inches',
      pearlType: 'Freshwater',
      colors: 'White, Pink, Black'
    }
  },
  {
    id: 'diamond-stud-earrings',
    name: 'Diamond Stud Earrings',
    price: 37999,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    description: 'Timeless round brilliant cut diamond stud earrings in 14K gold',
    brand: 'DiamondLux',
    inStock: true,
    specs: {
      material: '14K Gold',
      stone: 'Diamond (0.5ct total)',
      setting: 'Prong',
      metalColor: 'White Gold, Yellow Gold'
    }
  },
  {
    id: 'tennis-bracelet',
    name: 'Diamond Tennis Bracelet',
    price: 89999,
    image: 'https://images.unsplash.com/photo-1602173576902-4b95c7dda643?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Elegant tennis bracelet with channel-set diamonds',
    brand: 'LuxuryGold',
    inStock: true,
    specs: {
      material: '14K Gold',
      stone: 'Diamonds (3.0ct total)',
      length: '7 inches',
      setting: 'Channel'
    }
  },
  {
    id: 'gemstone-pendant',
    name: 'Sapphire Pendant Necklace',
    price: 32999,
    image: 'https://images.unsplash.com/photo-1602173577009-6ea3adf8f4d1?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Beautiful blue sapphire pendant on a delicate chain',
    brand: 'GemCraft',
    inStock: true,
    specs: {
      material: '14K Gold',
      stone: 'Blue Sapphire (1.5ct)',
      chainLength: '18 inches',
      gemstones: 'Sapphire, Ruby, Emerald'
    }
  },
  {
    id: 'hoop-earrings',
    name: 'Gold Hoop Earrings',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1611591437378-8e2a7a6c1a8a?w=500&auto=format&fit=crop&q=60',
    rating: 4.4,
    description: 'Classic gold hoop earrings with a modern twist',
    brand: 'GoldCraft',
    inStock: true,
    specs: {
      material: '14K Gold',
      diameter: '1.5 inches',
      closure: 'Hinged Snap',
      metalColor: 'Yellow Gold, Rose Gold, White Gold'
    }
  },
  {
    id: 'charm-bracelet',
    name: 'Personalized Charm Bracelet',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Customizable charm bracelet with initial pendant',
    brand: 'CharmWorld',
    inStock: true,
    specs: {
      material: 'Sterling Silver or 14K Gold',
      length: '7.5 inches',
      personalization: 'Up to 3 initials',
      type: 'Charm'
    }
  },
  {
    id: 'birthstone-ring',
    name: 'Birthstone Ring',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1603974379283-20f7b618b0a1?w=500&auto=format&fit=crop&q=60',
    rating: 4.3,
    description: 'Dainty ring with your choice of birthstone',
    brand: 'GemCraft',
    inStock: true,
    specs: {
      material: '10K Gold',
      stone: 'Birthstone of choice',
      size: 'Adjustable',
      colors: 'Various birthstone colors'
    }
  }
];

// Subcategories for jewelry
const subcategories = [
  { id: 'rings', name: 'Rings', count: 28 },
  { id: 'necklaces', name: 'Necklaces', count: 35 },
  { id: 'earrings', name: 'Earrings', count: 32 },
  { id: 'bracelets', name: 'Bracelets', count: 24 },
  { id: 'anklets', name: 'Anklets', count: 12 },
  { id: 'sets', name: 'Jewelry Sets', count: 18 },
  { id: 'bangles', name: 'Bangles', count: 22 },
  { id: 'brooches', name: 'Brooches', count: 8 }
];

// Brands filter
const brands = [
  { id: 'diamondlux', name: 'DiamondLux', count: 12 },
  { id: 'pearlelegance', name: 'PearlElegance', count: 10 },
  { id: 'luxurygold', name: 'LuxuryGold', count: 14 },
  { id: 'gemcraft', name: 'GemCraft', count: 11 },
  { id: 'goldcraft', name: 'GoldCraft', count: 9 },
  { id: 'charmworld', name: 'CharmWorld', count: 8 }
];

// Price ranges in PKR
const priceRanges = [
  { id: '0-10000', name: 'Under PKR 10,000', value: '0-10000' },
  { id: '10000-30000', name: 'PKR 10,000 - 30,000', value: '10000-30000' },
  { id: '30000-50000', name: 'PKR 30,000 - 50,000', value: '30000-50000' },
  { id: '50000-100000', name: 'PKR 50,000 - 100,000', value: '50000-100000' },
  { id: '100000', name: 'Over PKR 100,000', value: '100000' },
];

export default function JewelryPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = jewelryProducts.filter(product => {
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
      <div className="bg-gradient-to-r from-amber-600 to-yellow-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Jewelry & Accessories</h1>
          <p className="mt-4 text-xl text-amber-100">
            Discover exquisite fine jewelry and elegant accessories
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
                        href={`/${locale}/categories/fashion/jewelry/${category.id}`}
                        className="text-gray-600 hover:text-amber-600 text-sm"
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
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
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
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
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
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
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
                        className="w-full bg-amber-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
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
                            ? 'z-10 text-amber-600 bg-amber-50 border-amber-300'
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