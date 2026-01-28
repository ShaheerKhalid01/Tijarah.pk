'use client';

import { FiStar } from 'react-icons/fi';
import Image from 'next/image';

export default function ProductCard({ product, onViewDetails, formatPrice, renderRating }) {
  return (
    <div className="group relative">
      <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={400}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
        {product.isNew && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            New
          </div>
        )}
        {product.isOnSale && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Sale
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <button 
              onClick={(e) => {
                e.preventDefault();
                onViewDetails(product);
              }}
              className="text-left"
            >
              {product.name}
            </button>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
          <div className="mt-1 flex items-center">
            {renderRating(product.rating)}
            <span className="ml-2 text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(product.price)}
            {product.originalPrice && (
              <span className="ml-1 text-xs text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500">Free shipping</p>
        </div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => onViewDetails(product)}
        >
          Quick View
        </button>
      </div>
    </div>
  );
}
