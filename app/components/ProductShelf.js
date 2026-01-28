'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const ProductShelf = ({ title, products }) => {
  const { locale } = useParams();

  return (
    <div className="w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 tracking-tight"
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontWeight: 700,
          letterSpacing: '-0.02em'
        }}>
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-full">
        {products.map((product, index) => (
          <Link key={index} href={product.url || `/${locale}/products/${product.id}`}>
            <div className="cursor-pointer group w-full min-w-0">
              {/* Image Container with responsive dimensions */}
              <div className="relative bg-gray-50 rounded-xl overflow-hidden mb-4 w-full shadow-sm transition-all duration-300 group-hover:shadow-md"
                style={{ aspectRatio: '1/1', maxWidth: '100%' }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              {/* Product Info */}
              <h3 className="font-medium text-base md:text-lg line-clamp-2 mb-3 text-gray-900 leading-snug transition-colors group-hover:text-blue-600"
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  minHeight: '2.8rem',
                  fontWeight: 500
                }}>
                {product.name}
              </h3>

              {/* Price Section */}
              <div className="flex items-center gap-3 mb-3">
                {product.price && (
                  <span className="text-xl font-bold text-gray-900"
                    style={{
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontWeight: 700
                    }}>
                    ${product.price.toFixed(2)}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-gray-500 line-through"
                    style={{
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontWeight: 400
                    }}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Rating Section */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-base ${star <= Math.round(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-200'
                          }`}
                        style={{
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500"
                    style={{
                      fontFamily: 'var(--font-inter), sans-serif'
                    }}>
                    ({product.reviewCount?.toLocaleString() || '0'})
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductShelf;