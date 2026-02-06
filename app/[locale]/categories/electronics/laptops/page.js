'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

// Currency conversion rates (can be updated from API or config)
const CURRENCY_RATES = {
  PKR_TO_USD: 0.0036, // 1 PKR = 0.0036 USD (approximate)
};

// Helper for currency formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format((amount || 0) * CURRENCY_RATES.PKR_TO_USD);
};

// Mock data for laptops
export const laptops = [
  {
    id: 'macbook-pro-16',
    name: 'MacBook Pro 16"',
    price: 2499,
    originalPrice: 2699,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1675868374786-3edd36dddf04?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1675868373607-556b8fed6464?w=600&h=600&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 234,
    brand: 'apple',
    category: 'laptops',
    inStock: true,
    isNew: true,
    isHot: true,
    description: 'Powerful MacBook Pro with M3 Max chip for professionals.',
    stock: 18,
    specs: {
      processor: 'M3 Max',
      ram: '32GB',
      storage: '1TB SSD',
      display: '16.2" Liquid Retina XDR',
      graphics: '38-core GPU',
      weight: '4.7 lbs (2.1 kg)',
      os: 'macOS',
      battery: 'Up to 21 hours',
      ports: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3',
      wireless: 'Wi-Fi 6E, Bluetooth 5.3'
    }
  }
];

// Calculate category counts
const calculateCategoryCounts = (products) => {
  const counts = {};
  products.forEach(product => {
    counts[product.category] = (counts[product.category] || 0) + 1;
  });
  return counts;
};

const categoryCounts = calculateCategoryCounts(laptops);

// Category names mapping
const categoryNames = {
  'laptops': 'Laptops',
  'ultrabooks': 'Ultrabooks',
  'gaming': 'Gaming Laptops',
  'business': 'Business Laptops',
  'convertibles': '2-in-1 Convertibles',
  'budget': 'Budget Laptops'
};

// Calculate brand counts
const calculateBrandCounts = (products) => {
  const counts = {};
  products.forEach(product => {
    counts[product.brand] = (counts[product.brand] || 0) + 1;
  });
  return counts;
};

const brandCounts = calculateBrandCounts(laptops);

// Generate subcategories from category names
const subcategories = Object.entries(categoryNames).map(([id, name]) => ({
  id,
  name,
  count: categoryCounts[id] || 0
}));

// Brands filter with dynamic counts
const brands = [
  { id: 'apple', name: 'Apple', count: brandCounts['apple'] || 0 },
  { id: 'dell', name: 'Dell', count: brandCounts['dell'] || 0 },
  { id: 'hp', name: 'HP', count: brandCounts['hp'] || 0 },
  { id: 'lenovo', name: 'Lenovo', count: brandCounts['lenovo'] || 0 },
  { id: 'asus', name: 'ASUS', count: brandCounts['asus'] || 0 },
  { id: 'acer', name: 'Acer', count: brandCounts['acer'] || 0 },
  { id: 'microsoft', name: 'Microsoft', count: brandCounts['microsoft'] || 0 }
];

// Price ranges in USD (converted from PKR)
const priceRanges = [
  { id: 'under-1000', value: '0-1000', label: 'Under $1,000' },
  { id: '1000-2000', value: '1000-2000', label: '$1,000 - $2,000' },
  { id: '2000-3000', value: '2000-3000', label: '$2,000 - $3,000' },
  { id: 'over-3000', value: '3000-0', label: 'Over $3,000' }
];

export default function LaptopsPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Translation hooks
  const t = useTranslations('Laptops');
  const tProducts = useTranslations('products');

  // Filter products based on selected filters
  const filteredProducts = laptops.filter(laptop => {
    // Filter by brand
    if (selectedBrands.length > 0 && !selectedBrands.includes(laptop.brand)) {
      return false;
    }
    
    // Filter by price range
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (max && (laptop.price < min || laptop.price > max)) {
        return false;
      }
      if (!max && laptop.price < min) {
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">{t('title')}</h1>
          <p className="mt-4 text-xl text-blue-100">
            {t('subtitle')}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('categories')}</h3>
                <div className="space-y-2">
                  {subcategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <Link 
                        href={`/${locale}/categories/electronics/laptops/${category.id}`}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('priceRange')}</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        id={range.id}
                        type="radio"
                        name="price-range"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedPriceRange === range.value}
                        onChange={() => handlePriceRangeChange(range.value)}
                      />
                      <label htmlFor={range.id} className="ml-3 text-sm text-gray-600">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('brands')}</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <input
                        id={`brand-${brand.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                {t('showingResults', { start: indexOfFirstProduct + 1, end: Math.min(indexOfLastProduct, filteredProducts.length), total: filteredProducts.length })}
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                  {t('sortBy')}
                </label>
                <select
                  id="sort"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">{t('featured')}</option>
                  <option value="price-low">{t('priceLow')}</option>
                  <option value="price-high">{t('priceHigh')}</option>
                  <option value="rating">{t('rating')}</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((laptop) => (
                <div key={laptop.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                    <Link href={`/${locale}/products/${laptop.id}`} className="block">
                      <Image
                        src={laptop.image}
                        alt={laptop.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover object-center group-hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    {laptop.inStock && (
                      <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {t('inStock')}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={`/${locale}/products/${laptop.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {tProducts(`${laptop.id}.name`) || laptop.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{laptop.brand}</p>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <svg
                            key={rating}
                            className={`h-4 w-4 ${
                              rating < Math.floor(laptop.rating)
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
                          ({laptop.rating.toFixed(1)})
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-lg font-semibold text-gray-900">
                        PKR {laptop.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(laptop.price)}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {t('addToCart')}
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
                      <span className="sr-only">{t('pagination.previous')}</span>
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
                      <span className="sr-only">{t('pagination.next')}</span>
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