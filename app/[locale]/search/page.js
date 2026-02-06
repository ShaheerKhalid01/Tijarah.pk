'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Import all product data from product-data file
import { electronicsProducts, hotDeals, mockDeals, newArrivals, specialOffers } from '../../lib/product-data.js';

import { Suspense } from 'react';

function SearchResults() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  console.log('SearchResults locale:', locale, 'pathname:', pathname); // Debug log
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  // const t = useTranslations('common'); // Temporarily disabled
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all products
  useEffect(() => {
    const loadAllProducts = () => {
      // Transform electronics catalog products
      const electronicsCatalogProducts = electronicsProducts.map(product => ({
        _id: `electronics-${product.id}`,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: { name: product.category },
        image: product.image,
        images: product.images,
        stock: product.stock,
        sku: product.id,
        brand: product.brand,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.isNew,
        isHot: product.isHot,
        inStock: product.inStock,
        isCatalogProduct: true,
        productType: 'Electronics'
      }));

      // Transform special offers products
      const specialOffersProducts = specialOffers.map(product => ({
        _id: `special-${product.id}`,
        name: product.name,
        description: product.description || 'Special offer product with great discount',
        price: product.price,
        originalPrice: product.originalPrice,
        category: { name: product.category },
        image: product.image,
        images: product.images,
        stock: product.stock,
        sku: product.id,
        brand: product.brand,
        rating: null,
        reviewCount: null,
        isNew: product.isNew,
        isHot: product.isHot,
        inStock: true,
        isCatalogProduct: true,
        productType: 'Special Offer',
        discount: product.discount
      }));

      // Transform new arrivals products
      const newArrivalsProducts = newArrivals.map(product => ({
        _id: `new-${product.id}`,
        name: product.name,
        description: product.description || 'New arrival product',
        price: product.price,
        originalPrice: product.originalPrice,
        category: { name: product.category },
        image: product.image,
        images: product.images,
        stock: product.stock,
        sku: product.id,
        brand: product.brand,
        rating: null,
        reviewCount: null,
        isNew: product.isNew,
        isHot: product.isHot,
        inStock: true,
        isCatalogProduct: true,
        productType: 'New Arrival',
        discount: product.discount
      }));

      // Transform hot deals products
      const goodDealsProducts = hotDeals.map(product => ({
        _id: `hot-${product.id}`,
        name: product.name,
        description: product.description || 'Hot deal product',
        price: product.price,
        originalPrice: product.originalPrice,
        category: { name: product.category },
        image: product.image,
        images: product.images,
        stock: product.stock,
        sku: product.id,
        brand: product.brand,
        rating: product.rating,
        reviewCount: product.reviews,
        isNew: false,
        isHot: true,
        inStock: true,
        isCatalogProduct: true,
        productType: 'Good Deal',
        discount: product.discount,
        dealEnds: product.dealEnds,
        sold: product.sold,
        total: product.total
      }));

      // Transform today's deals products
      const todaysDealsProducts = mockDeals.map(product => ({
        _id: `today-${product.id}`,
        name: product.name,
        description: `Today's deal: ${product.name} with ${product.discount}% discount`,
        price: product.price,
        originalPrice: product.originalPrice,
        category: { name: 'Today\'s Deals' },
        image: product.images[0],
        images: product.images,
        stock: 50,
        sku: `TD-${product.id}`,
        brand: product.brand,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: false,
        isHot: true,
        inStock: true,
        isCatalogProduct: true,
        productType: 'Today\'s Deal',
        discount: product.discount,
        sold: product.sold
      }));

      // Combine all products
      const combinedProducts = [
        ...electronicsCatalogProducts,
        ...specialOffersProducts,
        ...newArrivalsProducts,
        ...goodDealsProducts,
        ...todaysDealsProducts
      ];

      setAllProducts(combinedProducts);
      setIsLoading(false);
    };

    loadAllProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts(allProducts);
    } else {
      const searchTerm = query.toLowerCase();
      const filtered = allProducts.filter(product => {
        const nameMatch = product?.name?.toLowerCase().includes(searchTerm) || false;
        const descMatch = product?.description?.toLowerCase().includes(searchTerm) || false;
        const categoryMatch = product?.category?.name?.toLowerCase().includes(searchTerm) || false;
        const brandMatch = product?.brand?.toLowerCase().includes(searchTerm) || false;

        return nameMatch || descMatch || categoryMatch || brandMatch;
      });
      setFilteredProducts(filtered);
    }
  }, [query, allProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? `Search Results for "${query}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            Found {filteredProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                href={`/${locale}/products/${product._id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <Image
                    src={product.image || (product.images && product.images[0]) || '/placeholder-product.jpg'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                      New
                    </span>
                  )}
                  {product.isHot && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                      Hot
                    </span>
                  )}
                  {product.discount && (
                    <span className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-lg font-bold text-blue-600">
                        ${product.price?.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${product.originalPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {product.productType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="truncate">{product.brand}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      In Stock: {product.stock || 'N/A'}
                    </span>
                  </div>
                  {product.rating && (
                    <div className="flex items-center mt-2">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
