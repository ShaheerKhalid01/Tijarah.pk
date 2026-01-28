'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaRegStar, FaRegHeart, FaShoppingCart } from 'react-icons/fa';

export default function ProductCard({ product, locale = 'en' }) {
  const {
    id,
    name,
    price,
    originalPrice,
    discount,
    image,
    rating,
    reviewCount,
    sold,
    timeLeft
  } = product;

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return (
      <div className="flex items-center mt-1">
        <div className="flex">{stars}</div>
        {reviewCount > 0 && (
          <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative pt-[100%] bg-gray-100">
        <Image
          src={image || '/images/placeholder-product.png'}
          alt={name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-20 transition-opacity duration-300">
          <button className="bg-white rounded-full p-2 text-gray-700 hover:bg-primary hover:text-white transition-colors duration-300 mx-1">
            <FaRegHeart className="w-5 h-5" />
          </button>
          <button className="bg-white rounded-full p-2 text-gray-700 hover:bg-primary hover:text-white transition-colors duration-300 mx-1">
            <FaShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-800 line-clamp-2 h-12 overflow-hidden">
          {name}
        </h3>
        
        <div className="mt-2">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-primary">
              ${price?.toFixed(2)}
            </span>
            {originalPrice > price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${originalPrice?.toFixed(2)}
              </span>
            )}
          </div>
          
          {discount > 0 && (
            <div className="text-xs text-green-600 mt-1">
              Save ${(originalPrice - price).toFixed(2)} ({discount}%)
            </div>
          )}
        </div>

        {renderRating()}

        {sold > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {sold}+ sold
          </div>
        )}

        {timeLeft && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Ends in:</div>
            <div className="flex space-x-1 text-xs">
              <div className="bg-gray-100 px-2 py-1 rounded">{timeLeft}</div>
            </div>
          </div>
        )}
      </div>

      <Link 
        href={`/${locale}/products/${id}`}
        className="block absolute inset-0 z-10"
        aria-label={`View ${name} details`}
      />
    </div>
  );
}
