'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { FiShoppingCart, FiFilter, FiStar, FiChevronDown, FiX } from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params?.locale || 'en';
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const { cart, addToCart } = useCart();
  const router = useRouter();

  const productsPerPage = 12;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?limit=200');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => 
        selectedBrands.includes(p.brand?.toLowerCase() || '')
      );
    }

    // Price filter
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        const price = p.price || 0;
        if (max) return price >= min && price <= max;
        return price >= min;
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, sortBy, selectedBrands, selectedPriceRange]);

  // Get unique brands from products
  const uniqueBrands = [...new Set(products.map(p => p.brand?.toLowerCase()).filter(Boolean))];
  const brandCounts = uniqueBrands.reduce((acc, brand) => {
    acc[brand] = products.filter(p => p.brand?.toLowerCase() === brand).length;
    return acc;
  }, {});

  // Price ranges
  const priceRanges = [
    { id: '0-100', name: 'Under $100', value: '0-100' },
    { id: '100-250', name: '$100 - $250', value: '100-250' },
    { id: '250-500', name: '$250 - $500', value: '250-500' },
    { id: '500-1000', name: '$500 - $1,000', value: '500-1000' },
    { id: '1000', name: '$1,000+', value: '1000' },
  ];

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0] || '/placeholder.jpg',
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`, {
      position: 'bottom-center',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '8px',
      },
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {category 
                  ? subcategory 
                    ? `${subcategory.replace(/-/g, ' ')}`
                    : `${category.replace(/-/g, ' ')}`
                  : 'All Products'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {loading ? 'Loading...' : `${filteredProducts.length} products found`}
              </p>
            </div>
            <Link 
              href={`/${locale}/cart`}
              className="relative inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <FiShoppingCart size={20} />
              <span className="font-semibold hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                  {cart.length > 99 ? '99+' : cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="space-y-6 sticky top-24">
              {/* Sort */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiChevronDown size={18} className="text-blue-600" />
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-3">
                  {priceRanges.map((range) => (
                    <label key={range.id} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        value={range.value}
                        checked={selectedPriceRange === range.value}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{range.name}</span>
                    </label>
                  ))}
                </div>
                {selectedPriceRange && (
                  <button
                    onClick={() => setSelectedPriceRange('')}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Brands */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Brands</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {uniqueBrands.length > 0 ? (
                    uniqueBrands.map((brand) => (
                      <label key={brand} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                        />
                        <span className="ml-3 text-sm text-gray-700 flex-1 group-hover:text-gray-900 capitalize">{brand}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {brandCounts[brand]}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No brands available</p>
                  )}
                </div>
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setSelectedBrands([])}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter & Sort */}
            <div className="lg:hidden mb-6 flex gap-3">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                <FiFilter size={18} />
                <span className="text-sm font-medium">Filters</span>
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Mobile Filters Drawer */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6 bg-white p-4 rounded-lg border border-gray-100 space-y-4">
                {/* Price Range Mobile */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.id} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          value={range.value}
                          checked={selectedPriceRange === range.value}
                          onChange={(e) => setSelectedPriceRange(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-3 text-sm text-gray-700">{range.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands Mobile */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Brands</h4>
                  <div className="space-y-2">
                    {uniqueBrands.map((brand) => (
                      <label key={brand} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-3 text-sm text-gray-700 capitalize flex-1">{brand}</span>
                        <span className="text-xs text-gray-500">{brandCounts[brand]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {loading ? 'Loading...' : `${indexOfFirstProduct + 1}–${Math.min(indexOfLastProduct, filteredProducts.length)} of ${filteredProducts.length} products`}
              </p>
              {(selectedBrands.length > 0 || selectedPriceRange) && (
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedPriceRange('');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <FiX size={14} />
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg font-semibold text-gray-900 mb-2">No products found</p>
                <p className="text-gray-500 mb-6">Try adjusting your filters or browse other categories</p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedPriceRange('');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <Link
                      key={product._id || product.id}
                      href={`/${locale}/products/${product._id || product.id}`}
                      className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative h-56 bg-gray-100 overflow-hidden">
                        <Image
                          src={product.image || product.images?.[0] || '/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                            -{product.discount}%
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex flex-col h-full">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
                          {product.brand || 'Brand'}
                        </p>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 flex-grow">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-1.5 mb-3">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  size={14}
                                  className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">
                              {product.rating.toFixed(1)} ({product.reviewCount || 0})
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              ${product.price?.toFixed(2) || '0.00'}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stock Status */}
                        <p className={`text-xs font-semibold mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </p>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={product.stock === 0}
                          className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                            product.stock > 0
                              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <FiShoppingCart size={16} />
                          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                      ← Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {totalPages <= 5 ? (
                        [...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                              currentPage === i + 1
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))
                      ) : (
                        <>
                          {currentPage > 2 && (
                            <>
                              <button
                                onClick={() => setCurrentPage(1)}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
                              >
                                1
                              </button>
                              {currentPage > 3 && <span className="px-2">...</span>}
                            </>
                          )}
                          {[...Array(Math.min(3, totalPages))].map((_, i) => {
                            const pageNum = currentPage - 1 + i;
                            if (pageNum < 1 || pageNum > totalPages) return null;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                                  currentPage === pageNum
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 hover:bg-gray-100'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          {currentPage < totalPages - 1 && (
                            <>
                              {currentPage < totalPages - 2 && <span className="px-2">...</span>}
                              <button
                                onClick={() => setCurrentPage(totalPages)}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
                              >
                                {totalPages}
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}