'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProductShelf = ({ title, products }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <Link key={index} href={product.url || '#'}>
            <div className="cursor-pointer group">
              {/* Image Container with consistent aspect ratio */}
              <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  priority={index === 0}
                />
              </div>

              {/* Product Info */}
              <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>

              {/* Price Section */}
              <div className="flex items-center gap-2 mb-2">
                {product.price && (
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
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
                        className={`text-lg ${
                          star <= Math.round(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    ({product.reviewCount || '0'})
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