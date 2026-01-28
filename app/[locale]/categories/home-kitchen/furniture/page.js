'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiHeart, FiStar, FiFilter, FiX } from 'react-icons/fi';

// Subcategories for furniture with counts
const subcategories = [
  { id: 'sofas', name: 'Sofas & Couches', count: 24 },
  { id: 'beds', name: 'Beds & Mattresses', count: 18 },
  { id: 'tables', name: 'Tables & Desks', count: 15 },
  { id: 'chairs', name: 'Chairs & Seating', count: 22 },
  { id: 'wardrobes', name: 'Wardrobes & Storage', count: 12 },
  { id: 'dining', name: 'Dining Sets', count: 16 },
  { id: 'shelving', name: 'Shelving Units', count: 10 },
  { id: 'outdoor', name: 'Outdoor Furniture', count: 14 }
];

// Price ranges for filters
const priceRanges = [
  { id: '0-50000', name: 'Under PKR 50,000', value: '0-50000' },
  { id: '50000-150000', name: 'PKR 50,000 - 150,000', value: '50000-150000' },
  { id: '150000-300000', name: 'PKR 150,000 - 300,000', value: '150000-300000' },
  { id: '300000-500000', name: 'PKR 300,000 - 500,000', value: '300000-500000' },
  { id: '500000', name: 'Over PKR 500,000', value: '500000' },
];

// Brands
const brands = [
  { id: 'ikea', name: 'IKEA', count: 15 },
  { id: 'habitt', name: 'Habitt', count: 12 },
  { id: 'home-express', name: 'Home Express', count: 10 },
  { id: 'gul-ahmed', name: 'Gul Ahmed', count: 8 },
  { id: 'nishat-linen', name: 'Nishat Linen', count: 6 },
  { id: 'dawlance', name: 'Dawlance', count: 5 },
  { id: 'chinoy', name: 'Chinoy', count: 4 },
  { id: 'al-karam', name: 'Al-Karam', count: 3 }
];

// Materials
const materials = [
  { id: 'wood', name: 'Solid Wood', count: 20 },
  { id: 'engineered-wood', name: 'Engineered Wood', count: 18 },
  { id: 'mdf', name: 'MDF', count: 15 },
  { id: 'metal', name: 'Metal', count: 12 },
  { id: 'glass', name: 'Glass', count: 10 },
  { id: 'leather', name: 'Leather', count: 8 },
  { id: 'fabric', name: 'Fabric', count: 14 },
  { id: 'rattan', name: 'Rattan', count: 6 }
];

// Mock data for furniture
const furnitureItems = [
  {
    id: 'ikea-ektorp-sofa',
    name: 'EKTORP 3-Seat Sofa',
    price: 149999,
    originalPrice: 169999,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: 'Comfortable 3-seat sofa with removable covers',
    brand: 'IKEA',
    category: 'sofas',
    inStock: true,
    materials: ['Fabric', 'Pine Wood'],
    colors: ['Beige', 'Gray', 'Blue'],
    isNew: true,
    isSale: true,
    specs: {
      dimensions: '214 x 88 x 88 cm',
      material: 'Polyester, Pine Wood',
      color: 'Beige',
      weight: '45 kg',
      warranty: '10 years'
    }
  },
  {
    id: 'habitt-queen-bed',
    name: 'Modern Queen Size Bed',
    price: 189999,
    originalPrice: 0,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    description: 'Minimalist queen size bed with storage',
    brand: 'Habitt',
    category: 'beds',
    inStock: true,
    materials: ['Engineered Wood', 'MDF'],
    colors: ['Walnut', 'White', 'Black'],
    isNew: true,
    isSale: false,
    specs: {
      dimensions: '210 x 165 x 100 cm',
      material: 'Engineered Wood, MDF',
      color: 'Walnut',
      weight: '60 kg',
      warranty: '5 years',
      mattressSize: 'Queen (60" x 78" x 10")'
    }
  },
  {
    id: 'dining-set-6',
    name: '6-Seater Dining Table Set',
    price: 249999,
    originalPrice: 279999,
    image: 'https://images.unsplash.com/photo-1556911220-bda9f5f762cd?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    description: 'Modern dining set with 6 chairs',
    brand: 'Home Express',
    category: 'dining',
    inStock: true,
    materials: ['Solid Wood', 'Upholstery'],
    colors: ['Brown', 'Black', 'White'],
    isNew: false,
    isSale: true,
    specs: {
      tableDimensions: '160 x 90 x 75 cm',
      chairDimensions: '45 x 55 x 90 cm',
      material: 'Solid Wood, Fabric',
      color: 'Brown',
      seatingCapacity: '6 persons',
      warranty: '2 years'
    }
  },
  {
    id: 'ergo-office-chair',
    name: 'Ergonomic Office Chair',
    price: 89999,
    originalPrice: 109999,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    description: 'Adjustable ergonomic office chair with lumbar support',
    brand: 'Chinoy',
    category: 'chairs',
    inStock: true,
    materials: ['Mesh', 'Metal', 'Plastic'],
    colors: ['Black', 'Gray', 'Blue'],
    isNew: true,
    isSale: true,
    specs: {
      dimensions: '64 x 64 x 120 cm',
      material: 'Mesh, Metal, Plastic',
      color: 'Black',
      weight: '25 kg',
      warranty: '5 years',
      maxWeight: '150 kg'
    }
  },
  {
    id: 'modern-tv-unit',
    name: 'Modern TV Unit with Storage',
    price: 129999,
    originalPrice: 0,
    image: 'https://images.unsplash.com/photo-1595435742679-7a4ca0d5c860?w=500&auto=format&fit=crop&q=60',
    rating: 4.4,
    description: 'Sleek TV unit with ample storage space',
    brand: 'Dawlance',
    category: 'wardrobes',
    inStock: true,
    materials: ['MDF', 'Glass', 'Metal'],
    colors: ['White', 'Walnut', 'Black'],
    isNew: false,
    isSale: false,
    specs: {
      dimensions: '180 x 50 x 45 cm',
      material: 'MDF, Tempered Glass, Metal',
      color: 'White',
      weight: '35 kg',
      warranty: '2 years',
      tvSize: 'Up to 65"'
    }
  },
  {
    id: 'outdoor-dining-set',
    name: 'Rattan Outdoor Dining Set',
    price: 189999,
    originalPrice: 219999,
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    description: '6-seater rattan outdoor dining set with cushions',
    brand: 'Home Express',
    category: 'outdoor',
    inStock: true,
    materials: ['Rattan', 'Glass', 'Fabric'],
    colors: ['Brown', 'Gray'],
    isNew: true,
    isSale: true,
    specs: {
      tableDimensions: '160 x 90 x 75 cm',
      chairDimensions: '45 x 55 x 90 cm',
      material: 'Synthetic Rattan, Tempered Glass, Weather-resistant Fabric',
      color: 'Brown',
      seatingCapacity: '6 persons',
      warranty: '3 years'
    }
  }
];

function FurniturePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on selected filters
  const filteredProducts = furnitureItems.filter(item => {
    // Filter by brand
    if (selectedBrands.length > 0 && !selectedBrands.includes(item.brand)) {
      return false;
    }
    
    // Filter by material
    if (selectedMaterials.length > 0 && !selectedMaterials.some(mat => item.materials.includes(mat))) {
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
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
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

  const handleMaterialToggle = (material) => {
    setSelectedMaterials(prev => 
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(prev => prev === range ? '' : range);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedMaterials([]);
    setSelectedPriceRange('');
    setCurrentPage(1);
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <FiStar
            key={`full-${i}`}
            className="h-4 w-4 text-yellow-400"
            fill="currentColor"
          />
        ))}
        
        {hasHalfStar && (
          <div className="relative h-4 w-4">
            <FiStar className="h-4 w-4 text-gray-300" fill="currentColor" />
            <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
              <FiStar className="h-4 w-4 text-yellow-400" fill="currentColor" />
            </div>
          </div>
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <FiStar
            key={`empty-${i}`}
            className="h-4 w-4 text-gray-300"
            fill="none"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Furniture</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-amber-600 hover:text-amber-700"
                >
                  Clear all
                </button>
              </div>

              {/* Category Filter */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {subcategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <Link 
                        href={`/${locale}/categories/furniture/${category.id}`}
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

              {/* Price Range Filter */}
              <div className="border-b border-gray-200 py-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        id={`price-${range.id}`}
                        name="price-range"
                        type="radio"
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                        checked={selectedPriceRange === range.value}
                        onChange={() => handlePriceRangeChange(range.value)}
                      />
                      <label
                        htmlFor={`price-${range.id}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {range.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="border-b border-gray-200 py-6">
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
                      <label
                        htmlFor={`brand-${brand.id}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {brand.name}
                      </label>
                      <span className="ml-auto text-xs text-gray-500">
                        {brand.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div className="pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Materials</h3>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <div key={material.id} className="flex items-center">
                      <input
                        id={`material-${material.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        checked={selectedMaterials.includes(material.name)}
                        onChange={() => handleMaterialToggle(material.name)}
                      />
                      <label
                        htmlFor={`material-${material.id}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {material.name}
                      </label>
                      <span className="ml-auto text-xs text-gray-500">
                        {material.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Filter Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="text-sm text-gray-500">
                Showing {filteredProducts.length} products
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
                    {/* Product Image Section */}
                    <div className="relative pt-[100%] bg-gray-200">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:opacity-75"
                      />
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col space-y-1">
                        {product.isNew && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                        {product.isSale && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Sale
                          </span>
                        )}
                        {!product.inStock && (
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      {/* Quick Actions */}
                      <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                          <FiHeart className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                          <FiShoppingCart className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info Section - This will push the button to the bottom */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-12">
                        <Link href={`/${locale}/product/${product.id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <div className="mt-1 flex items-center">
                        {renderStarRating(product.rating)}
                        <span className="ml-2 text-xs text-gray-500">
                          ({Math.floor(product.rating * 10)})
                        </span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <p className="text-lg font-semibold text-gray-900">
                          PKR {product.price.toLocaleString()}
                        </p>
                        {product.originalPrice > 0 && (
                          <p className="ml-2 text-sm text-gray-500 line-through">
                            PKR {product.originalPrice.toLocaleString()}
                          </p>
                        )}
                        {product.originalPrice > 0 && (
                          <p className="ml-2 text-sm font-medium text-green-600">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.colors.slice(0, 3).map((color, idx) => (
                          <span
                            key={idx}
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                        {product.colors.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{product.colors.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      {/* Add to Cart Button Container - This will be pushed to the bottom */}
                      <div className="mt-auto pt-4">
                        <button
                          type="button"
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500">No products found matching your filters.</div>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center">
                <nav
                  className="flex items-center space-x-2"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
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
                        onClick={() => paginate(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-amber-50 border-amber-500 text-amber-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FurniturePage;