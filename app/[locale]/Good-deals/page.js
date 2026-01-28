'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';
import { useCart } from '../../../contexts/CartContext';
import { useEffect } from 'react';

// Hot Deals Products Data
export const hotDeals = [
  {
    id: 'offer-1',
    name: 'iPhone 15 Pro',
    price: 999,
    originalPrice: 1199,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
    images: [
      'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1702184117235-56002cb13663?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1703434123142-1b41a1b1055b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D'
    ],
    brand: 'apple',
    category: 'smartphones',
    stock: 20,
    rating: 4.8,
    reviews: 1250,
    description: 'Latest iPhone with advanced camera system',
    dealEnds: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    sold: 45,
    total: 100,
    colors: ['Black', 'Silver', 'Gold', 'Deep Purple'],
    features: ['Advanced camera system', 'A16 Bionic chip', 'Super Retina XDR display'],
    specs: {
      'Display': '6.1 inch Super Retina XDR',
      'Processor': 'A16 Bionic',
      'Storage': '256GB / 512GB / 1TB'
    }
  },
  {
    id: 'offer-2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 999,
    originalPrice: 1199,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2Ftc3VuZyUyMEdhbGF4eSUyMFMyNCUyMFVsdHJhfGVufDB8fDB8fHww',
    images: [
      'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2Ftc3VuZyUyMEdhbGF4eSUyMFMyNCUyMFVsdHJhfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1705585175110-d25f92c183aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U2Ftc3VuZyUyMEdhbGF4eSUyMFMyNCUyMFVsdHJhfGVufDB8fDB8fHww'
    ],
    brand: 'samsung',
    category: 'smartphones',
    stock: 15,
    rating: 4.7,
    reviews: 892,
    description: '200MP camera with advanced features',
    dealEnds: new Date(Date.now() + 172800000).toISOString(), // 48 hours from now
    sold: 78,
    total: 100,
    colors: ['Onyx Black', 'Cream', 'Green', 'Purple'],
    features: ['200MP camera', '120Hz display', 'S Pen support'],
    specs: {
      'Display': '6.8 inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Battery': '5000mAh'
    }
  },
  {
    id: 'offer-3',
    name: 'MacBook Pro 16 inch',
    price: 1499,
    originalPrice: 1699,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1569770218135-bea267ed7e84?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFjYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D'
    ],
    brand: 'apple',
    category: 'laptops',
    stock: 10,
    rating: 4.9,
    reviews: 567,
    description: 'Professional laptop with M3 Pro',
    dealEnds: new Date(Date.now() + 259200000).toISOString(), // 72 hours from now
    sold: 32,
    total: 50,
    colors: ['Silver', 'Space Gray'],
    features: ['M3 Pro chip', 'Liquid Retina XDR display', 'Up to 22 hours battery'],
    specs: {
      'Display': '16.2 inch Liquid Retina XDR',
      'Processor': 'M3 Pro',
      'Memory': '16GB unified memory'
    }
  },
  {
    id: 'offer-4',
    name: 'Sony WH-1000XM5',
    price: 349,
    originalPrice: 449,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D'
    ],
    brand: 'sony',
    category: 'audio',
    stock: 25,
    rating: 4.9,
    reviews: 2145,
    description: 'Premium noise cancelling headphones',
    dealEnds: new Date(Date.now() + 129600000).toISOString(), // 36 hours from now
    sold: 92,
    total: 150,
    colors: ['Black', 'Silver', 'Blue'],
    features: ['Industry-leading noise cancellation', '30-hour battery life', 'DSEE Extreme'],
    specs: {
      'Connectivity': 'Bluetooth 5.2',
      'Battery Life': 'Up to 30 hours',
      'Weight': '250 grams'
    }
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

const categoryCounts = calculateCategoryCounts(hotDeals);

const categoryNames = {
  'smartphones': 'Smartphones',
  'laptops': 'Laptops',
  'audio': 'Audio',
  'tablets': 'Tablets',
  'smartwatches': 'Smartwatches',
  'cameras': 'Cameras'
};

const hotDealCategories = Object.entries(categoryCounts).map(([id, count]) => ({
  id,
  name: categoryNames[id] || id.charAt(0).toUpperCase() + id.slice(1),
  count
}));

// Calculate brand counts
const calculateBrandCounts = (products) => {
  const brandCounts = {};

  products.forEach(product => {
    if (product.brand) {
      brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
    }
  });

  return brandCounts;
};

const brandCounts = calculateBrandCounts(hotDeals);

const brands = [
  { id: 'apple', name: 'Apple', count: brandCounts['apple'] || 0 },
  { id: 'samsung', name: 'Samsung', count: brandCounts['samsung'] || 0 },
  { id: 'sony', name: 'Sony', count: brandCounts['sony'] || 0 }
].filter(brand => brand.count > 0);

// Price ranges
const priceRanges = [
  { id: '0-250', name: 'Under $250', value: '0-250' },
  { id: '250-500', name: '$250 - $500', value: '250-500' },
  { id: '500-1000', name: '$500 - $1000', value: '500-1000' },
  { id: '1000-1500', name: '$1000 - $1500', value: '1000-1500' },
  { id: '1500', name: 'Over $1500', value: '1500' },
];

// Helper function to get translated product data
export const getTranslatedProduct = (product, tProducts) => {
  let translatedName = product.name || product.id;
  try {
    const nameKey = `${product.id}.name`;
    const nameValue = tProducts(nameKey);
    if (nameValue && nameValue !== nameKey) {
      translatedName = nameValue;
    }
  } catch (error) {
    translatedName = product.name || product.id;
  }

  let translatedDescription = product.description || '';
  try {
    const descKey = `${product.id}.description`;
    const descValue = tProducts(descKey);
    if (descValue && descValue !== descKey) {
      translatedDescription = descValue;
    }
  } catch (error) {
    translatedDescription = product.description || '';
  }

  return {
    ...product,
    name: translatedName,
    description: translatedDescription,
    colors: product.colors || [],
    features: product.features || [],
    specs: product.specs || {}
  };
};

export default function GoodDealsPage() {
  const { locale } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const t = useTranslations('deals');
  const tCommon = useTranslations('common');
  const tProducts = useTranslations('products');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [addingToCart, setAddingToCart] = useState(false);
  const [timeLeftMap, setTimeLeftMap] = useState({});

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
    hotDeals.map(product => getTranslatedProduct(product, tProducts)),
    [tProducts]
  );

  // Calculate time left for each deal
  useEffect(() => {
    const calculateTimeLeft = () => {
      const newTimeLeft = {};
      hotDeals.forEach(deal => {
        const difference = new Date(deal.dealEnds) - new Date();
        if (difference > 0) {
          newTimeLeft[deal.id] = {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          };
        } else {
          newTimeLeft[deal.id] = { hours: 0, minutes: 0, seconds: 0 };
        }
      });
      setTimeLeftMap(newTimeLeft);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  // Filter products based on selected filters
  const filteredProducts = translatedProducts.filter((product) => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }

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
      case 'ending-soon':
      default:
        return new Date(a.dealEnds) - new Date(b.dealEnds);
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
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t('title_sub') || 'Don\'t miss out on these amazing deals. Limited quantities available!'}
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
                <h3 className="text-lg font-medium text-black mb-4">
                  {t('filter_options.all_categories')}
                </h3>
                <div className="space-y-2">
                  {hotDealCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <button
                        className="text-black hover:text-red-600 text-sm text-left w-full flex justify-between items-center"
                        onClick={() => { }}
                      >
                        <span>{category.name}</span>
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-black">
                          {category.count}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-black mb-4">
                  {t('filter_options.price_range')}
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        id={`price-${range.id}`}
                        name="price-range"
                        type="radio"
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        checked={selectedPriceRange === range.value}
                        onChange={() => handlePriceRangeChange(range.value)}
                      />
                      <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-black">
                        {range.name}
                      </label>
                    </div>
                  ))}
                  {selectedPriceRange && (
                    <button
                      onClick={() => setSelectedPriceRange('')}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      {t('filter_options.clear_filters')}
                    </button>
                  )}
                </div>
              </div>

              {/* Brands */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-black mb-4">
                  {t('filter_options.discount') || 'Brands'}
                </h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <input
                        id={`brand-${brand.id}`}
                        name="brand"
                        type="checkbox"
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => handleBrandToggle(brand.id)}
                      />
                      <label htmlFor={`brand-${brand.id}`} className="ml-3 text-sm text-black flex-1">
                        {brand.name}
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 ml-2">
                          {brand.count}
                        </span>
                      </label>
                    </div>
                  ))}
                  {selectedBrands.length > 0 && (
                    <button
                      onClick={() => setSelectedBrands([])}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      {t('filter_options.clear_filters')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-sm text-black">
                {t('filter_options.showing', {
                  start: indexOfFirstProduct + 1,
                  end: Math.min(indexOfLastProduct, filteredProducts.length),
                  total: filteredProducts.length
                })}
              </p>
              <div className="shrink-0">
                <label htmlFor="sort" className="sr-only">
                  Sort
                </label>
                <select
                  id="sort"
                  name="sort"
                  className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm text-black"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="ending-soon">
                    {t('sort_options.ending_soon') || 'Ending Soon'}
                  </option>
                  <option value="discount-high">
                    {t('sort_options.discount') || 'Biggest Discount'}
                  </option>
                  <option value="price-low">
                    {t('sort_options.price_low') || 'Price: Low to High'}
                  </option>
                  <option value="price-high">
                    {t('sort_options.price_high') || 'Price: High to Low'}
                  </option>
                </select>
              </div>
            </div>

            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${locale}/products/${product.id}`}
                    className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 block"
                    onClick={(e) => {
                      console.log('Navigating to product:', {
                        id: product.id,
                        name: product.name,
                        href: `/${locale}/products/${product.id}`
                      });
                    }}
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      <div className="relative h-full w-full">
                        <Image
                          src={product.images?.[0] || product.image || '/images/placeholder-product.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover object-center group-hover:opacity-90 transition-opacity"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          onError={(e) => {
                            e.target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                        {!product.images?.[0] && !product.image && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {t('off') || 'DEAL'} -{product.discount}%
                        </span>
                      </div>

                      {/* Time Left */}
                      {timeLeftMap[product.id] && (
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                          {timeLeftMap[product.id].hours}h {timeLeftMap[product.id].minutes}m {timeLeftMap[product.id].seconds}s
                        </div>
                      )}
                    </div>

                    {/* Stock Progress */}
                    <div className="px-4 pt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(product.sold / product.total) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        {t('sold') || 'Sold'}: {product.sold}/{product.total}
                      </p>
                    </div>

                    <div className="p-4 pt-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-black line-clamp-2 h-14">
                            {product.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-black line-through">
                            ${product.originalPrice}
                          </p>
                          <p className="text-lg font-bold text-red-600">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-black line-clamp-2 flex-1 pr-2">
                          {product.description}
                        </p>
                        <div className="flex gap-2">
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={addingToCart === product.id}
                            title={tCommon('addToCart')}
                          >
                            <FiShoppingCart className="w-5 h-5" />
                          </button>
                          <button
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/${locale}/products/${product.id}`);
                            }}
                          >
                            {t('view_details') || 'View Deal'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-black">
                  {t('no_deals') || 'No deals found'}
                </h3>
                <p className="mt-1 text-black">
                  {t('filters.clear_filters') || 'Try adjusting your filters'}
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedPriceRange('');
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {t('filters.clear_filters') || 'Clear All Filters'}
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
                  <p className="text-sm text-black">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div className="flex-1 flex justify-between sm:justify-end space-x-2">
                  <button
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50"
                    aria-label="Previous"
                  >
                    <span className="sr-only">Previous</span>
                    &laquo;
                  </button>
                  <button
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50"
                    aria-label="Next"
                  >
                    <span className="sr-only">Next</span>
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