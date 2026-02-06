'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Heart, Share2, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, ShoppingCart, CreditCard } from 'lucide-react';
import Notification from '../../components/Notification';

// Mock product data - in a real app, this would come from an API
const productData = {
  '1': {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    brand: 'AudioPro',
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.5,
    reviewCount: 1245,
    inStock: true,
    description: 'Experience crystal clear sound with our premium wireless Bluetooth headphones. Featuring noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions for extended listening sessions.',
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Built-in microphone',
      'Bluetooth 5.0',
      'Foldable design',
      'Touch controls'
    ],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Black', 'White', 'Blue', 'Red'],
    sizes: ['S', 'M', 'L', 'XL'],
    specifications: {
      'Brand': 'AudioPro',
      'Model': 'WH-1000XM4',
      'Connectivity': 'Bluetooth 5.0',
      'Battery Life': '30 hours',
      'Charging Time': '3 hours',
      'Weight': '254g',
      'Warranty': '1 year'
    },
    relatedProducts: [
      { id: '2', name: 'Wireless Earbuds', price: 89.99, image: 'https://images.unsplash.com/photo-1578281768004-4d6c4f03c8b0?w=800&auto=format&fit=crop&q=80' },
      { id: '3', name: 'Portable Speaker', price: 79.99, image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80' },
      { id: '4', name: 'Noise Cancelling Headphones', price: 149.99, image: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800&auto=format&fit=crop&q=80' },
    ]
  }
};

export default function ProductPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    setIsClient(true);
    // Load cart from localStorage if it exists
    const savedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const addToCart = () => {
    if (!selectedSize) {
      showNotification('Please select a size', 'error');
      return;
    }

    setIsAddingToCart(true);
    
    const cartItem = {
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity: quantity
    };

    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(
      item => item.id === cartItem.id
    );

    if (existingItemIndex > -1) {
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      updatedCart.push(cartItem);
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Show success message
    showNotification(
      `${product.name} (${selectedSize}) has been added to your cart!`,
      'cart'
    );
    setIsAddingToCart(false);
  };

  const buyNow = () => {
    if (!selectedSize) {
      showNotification('Please select a size', 'error');
      return;
    }
    
    setIsBuyingNow(true);
    
    // Add to cart and proceed to checkout
    setTimeout(() => {
      addToCart();
      showNotification('Proceeding to checkout...', 'success');
      setIsBuyingNow(false);
      // Redirect to localized checkout
      router.push('/en/checkout'); // Default to English, could be made dynamic
    }, 1000);
  };

  const product = productData[params.id] || productData['1']; // Fallback to first product if ID not found

  if (!product) {
    return <div className="container mx-auto py-10">Product not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification.show && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      )}
      {/* Breadcrumb */}
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/" className="text-blue-600 hover:underline">Home</a>
            <ChevronRight className="w-4 h-4 mx-1" />
            <a href="/" className="text-blue-600 hover:underline">Electronics</a>
            <ChevronRight className="w-4 h-4 mx-1" />
            <a href="/" className="text-blue-600 hover:underline">Headphones</a>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-500">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {isClient && product.images[selectedImage] && (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                {isClient && (
                  <>
                    <button 
                      className="absolute top-1/2 left-2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                      onClick={() => setSelectedImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                      className="absolute top-1/2 right-2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                      onClick={() => setSelectedImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              {isClient && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                  <Star className="w-3 h-3 fill-current mr-1" />
                  <span>{product.rating}</span>
                </div>
                <a href="#reviews" className="text-blue-600 text-sm ml-2 hover:underline">
                  {product.reviewCount} reviews
                </a>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-green-600 text-sm font-medium">In Stock</span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                      <span className="ml-2 text-sm font-medium text-green-600">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-green-600 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Color Selection */}
              {product.colors && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                  <div className="flex space-x-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-blue-500' : 'border-gray-300'}`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border rounded-l-md flex items-center justify-center text-xl text-gray-600 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <div className="w-16 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border rounded-r-md flex items-center justify-center text-xl text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button 
                  onClick={addToCart}
                  disabled={isAddingToCart}
                  className={`flex-1 ${
                    isAddingToCart 
                      ? 'bg-yellow-300 cursor-not-allowed' 
                      : 'bg-yellow-400 hover:bg-yellow-500'
                  } text-gray-900 font-medium py-3 px-6 rounded-md shadow-sm transition-colors flex items-center justify-center`}
                >
                  {isAddingToCart ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button 
                  onClick={buyNow}
                  disabled={isBuyingNow}
                  className={`flex-1 ${
                    isBuyingNow 
                      ? 'bg-orange-400 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  } text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors flex items-center justify-center`}
                >
                  {isBuyingNow ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Buy Now
                    </>
                  )}
                </button>
              </div>

              {/* Delivery Info */}
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                    <p className="text-xs text-gray-500">Delivered by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">1 Year Warranty</p>
                    <p className="text-xs text-gray-500">Covered by Tijarah's warranty policy</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">10 Days Return Policy</p>
                    <p className="text-xs text-gray-500">Easy return and exchange process</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 text-sm font-medium">
                  Description
                </button>
                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  Specifications
                </button>
                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  Reviews ({product.reviewCount})
                </button>
              </nav>
            </div>

            <div className="py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Specifications</h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-100 pb-2">
                        <dt className="text-gray-500">{key}</dt>
                        <dd className="font-medium text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {product.relatedProducts.map((item) => (
                  <a key={item.id} href={`/products/${item.id}`} className="group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <h3 className="text-sm text-gray-900 font-medium mt-2">{item.name}</h3>
                    <p className="text-sm font-bold text-gray-900">${item.price.toFixed(2)}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
