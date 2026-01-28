'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';
import { useCart } from '../../../contexts/CartContext';

// Base product data (non-translatable properties)
export const newArrivals = [
  {
    id: 'headphones-1',
    name: 'Sony WH-1000XM3',
    price: 249,
    originalPrice: 299,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1586343797367-c8942268df67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U29ueSUyMFdILTEwMDBYTTN8ZW58MHx8MHx8fDA%3D',
    images: [
      'https://images.unsplash.com/photo-1586343797367-c8942268df67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U29ueSUyMFdILTEwMDBYTTN8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U29ueSUyMFdILTEwMDBYTTN8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1595582693131-fd8df824174a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U29ueSUyMFdILTEwMDBYTTN8ZW58MHx8MHx8fDA%3D'
    ],
    isNew: true,
    isHot: true,
    brand: 'sony',
    category: 'audio',
    stock: 15
  },
  {
    id: 'smartphone-1',
    name: 'iPhone 15',
    price: 1199,
    originalPrice: 1399,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
    images: [
      'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1702184117235-56002cb13663?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1703434123142-1b41a1b1055b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D'
    ],
    isNew: true,
    isHot: true,
    brand: 'apple',
    category: 'smartphones',
    stock: 20
  },
  {
    id: 'laptop-1',
    name: 'MacBook Pro',
    price: 1599,
    originalPrice: 1799,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1567535343204-4b3f10787c4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [
      'https://images.unsplash.com/photo-1567535343204-4b3f10787c4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1569770218135-bea267ed7e84?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFjYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D'
    ],
    isNew: true,
    isHot: true,
    brand: 'apple',
    category: 'laptops',
    stock: 10
  },
  {
    id: 'smartwatch-1',
    name: 'Apple Watch Ultra 3',
    price: 799,
    originalPrice: 899,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1758348844371-dfbae2780bd3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [
      'https://images.unsplash.com/photo-1758348844371-dfbae2780bd3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1708920325933-5988622fe361?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QXBwbGUlMjBXYXRjaCUyMFVsdHJhJTIwM3xlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1648991680226-796783b22903?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QXBwbGUlMjBXYXRjaCUyMFVsdHJhJTIwM3xlbnwwfHwwfHx8MA%3D%3D'
    ],
    isNew: true,
    isHot: false,
    brand: 'apple',
    category: 'smartwatches',
    stock: 15
  }
];

// Calculate category counts from products
const calculateCategoryCounts = (products) => {
  const categoryCounts = {};

  products.forEach(product => {
    if (product.category) {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    }
  });

  return categoryCounts;
};

// Get category counts from actual products
const categoryCounts = calculateCategoryCounts(newArrivals);

// Category names mapping
const categoryNames = {
  'smartphones': 'Smartphones',
  'laptops': 'Laptops',
  'tablets': 'Tablets',
  'audio': 'Audio',
  'smartwatches': 'Smartwatches',
  'cameras': 'Cameras'
};

// Generate categories from actual product data
const newArrivalCategories = Object.entries(categoryCounts).map(([id, count]) => ({
  id,
  name: categoryNames[id] || id.charAt(0).toUpperCase() + id.slice(1),
  count
}));

// Calculate brand counts from products
const calculateBrandCounts = (products) => {
  const brandCounts = {};

  products.forEach(product => {
    if (product.brand) {
      brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
    }
  });

  return brandCounts;
};

// Get brand counts from actual products
const brandCounts = calculateBrandCounts(newArrivals);

// Brands filter with dynamic counts
const brands = [
  { id: 'apple', name: 'Apple', count: brandCounts['apple'] || 0 },
  { id: 'samsung', name: 'Samsung', count: brandCounts['samsung'] || 0 },
  { id: 'sony', name: 'Sony', count: brandCounts['sony'] || 0 }
].filter(brand => brand.count > 0);

// Price ranges
const priceRanges = [
  { id: '0-100', name: 'Under $100', value: '0-100' },
  { id: '100-250', name: '$100 - $250', value: '100-250' },
  { id: '250-500', name: '$250 - $500', value: '250-500' },
  { id: '500-1000', name: '$500 - $1000', value: '500-1000' },
  { id: '1000', name: 'Over $1000', value: '1000' },
];

// Helper function to get translated product data
export const getTranslatedProduct = (product, tProducts) => {
  // Get translated product name with proper error handling
  let translatedName = product.name || product.id;
  try {
    const nameKey = `${product.id}.name`;
    const nameValue = tProducts(nameKey);
    if (nameValue && nameValue !== nameKey) {
      translatedName = nameValue;
    }
  } catch (error) {
    // Use fallback name from component data
    translatedName = product.name || product.id;
  }

  // Get translated description with proper error handling
  let translatedDescription = product.description || '';
  try {
    const descKey = `${product.id}.description`;
    const descValue = tProducts(descKey);
    if (descValue && descValue !== descKey) {
      translatedDescription = descValue;
    }
  } catch (error) {
    // Use fallback description from product data
    translatedDescription = product.description || '';
  }

  return {
    ...product,
    name: translatedName, // Translatable product name
    description: translatedDescription,
    colors: product.colors || [],
    features: product.features || [],
    specs: product.specs || {}
  };
};

export default function NewArrivalsPage() {
  const { locale } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const t = useTranslations('NewArrivals');
  const tCommon = useTranslations('common');
  const tProducts = useTranslations('products');
  const [sortBy, setSortBy] = useState('featured');
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(product.id);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      // Optional: Show success message or toast
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const translatedProducts = useMemo(() =>
    newArrivals.map(product => getTranslatedProduct(product, tProducts)),
    [tProducts, newArrivals]
  );

  // Filter products based on selected filters
  const filteredProducts = translatedProducts.filter((product) => {
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
      case 'discount-high':
        return parseFloat(b.discount) - parseFloat(a.discount);
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
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="space-y-6 sticky top-4">
              {/* Categories */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('filters.categories')}
                </h3>
                <div className="space-y-2">
                  {newArrivalCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <button
                        className="text-gray-600 hover:text-blue-600 text-sm text-left w-full flex justify-between items-center"
                        onClick={() => { }}
                      >
                        <span>
                          {category.name}
                        </span>
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
                          {category.count}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('filters.priceRange')}
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        id={`price-${range.id}`}
                        name="price-range"
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={selectedPriceRange === range.value}
                        onChange={() => handlePriceRangeChange(range.value)}
                      />
                      <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-gray-700">
                        {range.name}
                      </label>
                    </div>
                  ))}
                  {selectedPriceRange && (
                    <button
                      onClick={() => setSelectedPriceRange('')}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      {t('filters.clearPrice')}
                    </button>
                  )}
                </div>
              </div>

              {/* Brands */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('filters.brands')}
                </h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <input
                        id={`brand-${brand.id}`}
                        name="brand"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => handleBrandToggle(brand.id)}
                      />
                      <label htmlFor={`brand-${brand.id}`} className="ml-3 text-sm text-gray-700 flex-1">
                        {brand.name}
                      </label>
                      <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-600">
                        {brand.count}
                      </span>
                    </div>
                  ))}
                  {selectedBrands.length > 0 && (
                    <button
                      onClick={() => setSelectedBrands([])}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      {t('filters.clearBrands')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sorting and results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-sm text-gray-700">
                {t('pagination.showing', {
                  start: indexOfFirstProduct + 1,
                  end: Math.min(indexOfLastProduct, filteredProducts.length),
                  total: filteredProducts.length
                })}
              </p>
              <div className="flex-shrink-0">
                <label htmlFor="sort" className="sr-only">
                  Sort
                </label>
                <select
                  id="sort"
                  name="sort"
                  className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm text-gray-900"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">
                    {t('sort.featured')}
                  </option>
                  <option value="discount-high">
                    {t('sort.discountHigh')}
                  </option>
                  <option value="price-low">
                    {t('sort.priceLow')}
                  </option>
                  <option value="price-high">
                    {t('sort.priceHigh')}
                  </option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${locale}/products/${product.id}`}
                    className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 block"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={product.image || '/images/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:opacity-90 transition-opacity"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {product.isNew && (
                          <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            {t('badges.new')}
                          </span>
                        )}
                        {product.isHot && (
                          <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            {t('badges.hot')}
                          </span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 line-clamp-2 h-14">
                            {product.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-gray-600 line-clamp-2 flex-1 pr-2">
                          {product.description}
                        </p>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/${locale}/products/${product.id}`);
                          }}
                        >
                          {t('viewDetails')}
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('noProducts.title')}
                </h3>
                <p className="mt-1 text-gray-500">
                  {t('noProducts.description')}
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedPriceRange('');
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('noProducts.clearFilters')}
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-8"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div className="flex-1 flex justify-between sm:justify-end space-x-2">
                  <button
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    aria-label={t('pagination.previous')}
                  >
                    <span className="sr-only">
                      {t('pagination.previous')}
                    </span>
                    &laquo;
                  </button>
                  <button
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    aria-label={t('pagination.next')}
                  >
                    <span className="sr-only">
                      {t('pagination.next')}
                    </span>
                    &raquo;
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}