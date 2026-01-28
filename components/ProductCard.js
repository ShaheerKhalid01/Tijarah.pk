'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { FiShoppingCart, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [showAdded, setShowAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto-rotate images when hovered
  useEffect(() => {
    let interval;
    if (isHovered && product.images?.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isHovered, product.images]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
      inStock: product.inStock !== false
    });
    
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`} className="block">
        <div 
          className="relative h-48 w-full overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setCurrentImageIndex(0);
          }}
        >
          {/* Main Image */}
          <Image
            src={product.images?.[currentImageIndex] || product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Navigation Arrows */}
          {product.images?.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors z-10"
                aria-label="Previous image"
              >
                <FiChevronLeft size={20} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors z-10"
                aria-label="Next image"
              >
                <FiChevronRight size={20} />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2 h-14 overflow-hidden">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2 h-10 overflow-hidden">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-3">
            <span className="font-bold text-lg">${product.price?.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="mt-3 flex justify-between items-center">
            {product.originalPrice && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                )}% OFF
              </span>
            )}
            <button
              onClick={handleAddToCart}
              disabled={product.inStock === false}
              className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                showAdded
                  ? 'bg-green-500 text-white'
                  : product.inStock === false
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-600 text-white hover:bg-pink-700'
              }`}
              title={product.inStock === false ? 'Out of stock' : 'Add to cart'}
            >
              {showAdded ? (
                <>
                  <FiCheck className="mr-1" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <FiShoppingCart className="mr-1" />
                  <span>{product.inStock === false ? 'Out of Stock' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
