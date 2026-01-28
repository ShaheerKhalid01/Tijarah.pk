'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiShare2, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

// Mock product data - in a real app, you would fetch this from your API
const mockProducts = {
  1: {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 199.99,
    originalPrice: 249.99,
    description: 'Experience crystal clear sound with our premium wireless headphones. Featuring active noise cancellation and 30-hour battery life.',
    rating: 4.8,
    reviewCount: 1245,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1546435770-a2e5bf95c5e9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800&h=800&fit=crop'
    ],
    colors: ['Black', 'White', 'Blue'],
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Built-in microphone',
      'Bluetooth 5.0',
      'Foldable design'
    ]
  },
  // Add more mock products as needed
};

export default function ProductDetail() {
  const { id, locale } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the product data here
    // For now, we'll use the mock data
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const productData = mockProducts[id] || null;
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-lg aspect-square"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2 mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-indigo-500 ${
                      selectedImage === index ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <span className="sr-only">View for {product.name}</span>
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main image */}
            <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-center object-cover"
                priority
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
              {product.originalPrice > product.price && (
                <p className="text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
              )}
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <svg
                      key={rating}
                      className={`h-5 w-5 ${
                        product.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">{product.reviewCount} reviews</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm text-gray-600">Features</h3>
                <ul className="mt-2 pl-4 list-disc text-sm text-gray-600 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm text-gray-600">Color</h3>
                <fieldset className="mt-2">
                  <legend className="sr-only">Choose a color</legend>
                  <div className="flex items-center space-x-3">
                    {product.colors.map((color) => (
                      <label key={color} className="flex items-center">
                        <input
                          type="radio"
                          name="color-choice"
                          value={color}
                          className="sr-only"
                          defaultChecked={color === 'Black'}
                        />
                        <span className="inline-block w-8 h-8 rounded-full border border-gray-300 overflow-hidden">
                          <span
                            className="block w-full h-full"
                            style={{
                              backgroundColor: color.toLowerCase(),
                              backgroundImage: color.toLowerCase() === 'white' ? 'linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%,#e5e7eb 100%)' : 'none'
                            }}
                            aria-hidden="true"
                          />
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center">
                <span className="text-gray-700">Quantity</span>
                <div className="ml-4 flex items-center">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-gray-600 hover:text-gray-500"
                  >
                    <span className="sr-only">Decrease quantity</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="mx-2 text-gray-900 w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-gray-600 hover:text-gray-500"
                  >
                    <span className="sr-only">Increase quantity</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col space-y-4">
                <button
                  type="button"
                  className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiShoppingCart className="mr-2 h-5 w-5" />
                  Add to cart
                </button>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiHeart className="mr-2 h-5 w-5" />
                    Save
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiShare2 className="mr-2 h-5 w-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900">Shipping & Returns</h3>
              <p className="mt-2 text-sm text-gray-500">
                Free standard shipping on all orders. Easy returns within 30 days. 
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Learn more</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}