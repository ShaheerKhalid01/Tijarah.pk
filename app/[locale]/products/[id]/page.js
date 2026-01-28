'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiShare2, FiInfo, FiStar, FiTruck, FiRotateCcw, FiCheck, FiShield } from 'react-icons/fi';
import Link from 'next/link';
import { useCart } from '../../../../contexts/CartContext';
import { useTranslations } from 'next-intl';
import { toast, Toaster } from 'react-hot-toast';
import { electronicsProducts } from '../../categories/electronics/page';
import { specialOffers } from '../../special-offers/page';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const locale = params?.locale || 'en';
  
  const t = useTranslations('ProductDetail');
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Fetch product from API
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        
        if (data.data) {
          const productData = data.data;
          
          // Make sure we have images array
          const images = productData.images && Array.isArray(productData.images) 
            ? productData.images 
            : [productData.image || '/placeholder-product.jpg'];
          
          setProduct({
            ...productData,
            images: images,
            description: productData.description || 'Premium quality product with excellent features and specifications.'
          });
          setError(null);
        } else {
          setError('Product not found');
          setProduct(null);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message || 'Failed to load product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      addToCart({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
        inStock: product.inStock || (product.stock > 0)
      });
      toast.success(t('toast.addedToCart', { name: product.name }), {
        position: 'bottom-center',
        style: {
          borderRadius: '12px',
          background: '#1e40af',
          color: '#fff',
        },
      });
      setTimeout(() => setIsAddingToCart(false), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(t('toast.failedToAdd'));
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
        <div className="bg-red-50 p-8 rounded-3xl flex flex-col items-center max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
            <FiInfo size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('notFound.title')}</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">{t('notFound.description')}</p>
          <Link
            href={`/${locale}/categories`}
            className="w-full px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold"
          >
            {t('notFound.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.images || [product.image];
  console.log('Rendering with images:', productImages);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-4">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-10 gap-2 overflow-x-auto whitespace-nowrap pb-2">
          <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors">{t('navigation.home')}</Link>
          <span>/</span>
          <Link href={`/${locale}/categories`} className="hover:text-blue-600 transition-colors">{t('navigation.products')}</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Product Images - 7 Columns */}
            <div className="lg:col-span-7 p-6 lg:p-10 bg-white border-r border-slate-50">
              <div className="sticky top-10">
                <Swiper
                  style={{
                    '--swiper-navigation-color': '#1e40af',
                    '--swiper-pagination-color': '#1e40af',
                  }}
                  spaceBetween={10}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[FreeMode, Navigation, Thumbs, Pagination]}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  className="rounded-3xl bg-slate-50 overflow-hidden aspect-square border border-slate-100 mb-4 h-[500px]"
                >
                  {productImages.length > 0 ? (
                    productImages.map((img, index) => (
                      <SwiperSlide key={index} className="flex items-center justify-center p-8 bg-white">
                        <div className="relative w-full h-full">
                          <Image
                            src={img}
                            alt={`${product.name} - View ${index + 1}`}
                            fill
                            className="object-contain"
                            priority={index === 0}
                          />
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide className="flex items-center justify-center p-8 bg-white">
                      <div className="relative w-full h-full">
                        <Image
                          src="/placeholder-product.jpg"
                          alt="Product"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </SwiperSlide>
                  )}
                </Swiper>

                {productImages.length > 1 && (
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={12}
                    slidesPerView={Math.min(productImages.length, 4)}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="thumbs-swiper"
                  >
                    {productImages.map((img, index) => (
                      <SwiperSlide key={index} className="rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent transition-all">
                        <div className="relative aspect-square bg-slate-50">
                          <Image src={img} alt="" fill className="object-cover" />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            </div>

            {/* Product Info - 5 Columns */}
            <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-lg">
                    {product.brand || 'Premium'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setIsWishlisted(!isWishlisted)} className={`p-2.5 rounded-xl border transition-all ${isWishlisted ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-slate-100 text-slate-400 hover:text-red-600'}`}>
                      <FiHeart size={20} className={isWishlisted ? 'fill-current' : ''} />
                    </button>
                    <button className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 bg-white transition-all">
                      <FiShare2 size={20} />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 leading-tight">{product.name}</h1>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl">
                    <FiStar className="text-yellow-500 fill-current" size={16} />
                    <span className="text-sm font-bold text-yellow-700">{product.rating || 4.8}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-400 border-l border-slate-200 pl-4">{product.reviewCount || 120} {t('reviews')}</span>
                  <span className={`text-xs font-black uppercase tracking-tight px-3 py-1.5 rounded-lg border ml-auto ${(product.inStock || product.stock > 0) ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {(product.inStock || product.stock > 0) ? t('stock.readyToShip') : t('stock.soldOut')}
                  </span>
                </div>

                <div className="mb-10 group">
                  <div className="inline-flex items-baseline gap-4 mb-4 p-8 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] text-white w-full shadow-xl shadow-blue-200 group-hover:scale-[1.02] transition-transform duration-500">
                    <span className="text-4xl font-black">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xl text-blue-200/60 line-through">${product.originalPrice}</span>
                    )}
                    {product.discount && product.discount > 0 && (
                      <span className="ml-auto bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-lg leading-relaxed">{product.description}</p>
                </div>

                <div className="space-y-8 mb-10">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-600"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-600"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={!(product.inStock || product.stock > 0) || isAddingToCart}
                      className={`flex-1 w-full h-16 rounded-2xl font-black flex items-center justify-center gap-3 transition-all relative overflow-hidden group/btn ${isAddingToCart ? 'bg-green-600 text-white' :
                        (product.inStock || product.stock > 0) ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200' :
                          'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                      {isAddingToCart ? (
                        <>
                          <FiCheck size={24} className="animate-bounce" />
                          <span>{t('buttons.addedToCart')}</span>
                        </>
                      ) : (
                        <>
                          <FiShoppingCart size={22} className="group-hover/btn:translate-x-1 transition-transform" />
                          <span>{t('buttons.addToCart')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <FiTruck size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{t('trust.swiftDelivery')}</p>
                    <p className="text-xs text-slate-500">{t('trust.freeOver')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <FiShield size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{t('trust.secureWarranty')}</p>
                    <p className="text-xs text-slate-500">{t('trust.genuine')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features / Details Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              {t('sections.coreFeatures')}
            </h3>
            <ul className="space-y-4">
              {(product.features || ['Premium Build Quality', 'High Performance', 'Energy Efficient', 'Advanced Features']).map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 leading-relaxed font-medium">
                  <FiCheck className="text-green-500 mt-1 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              {t('sections.technicalSpecifications')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
              {Object.entries(product.specs || {
                'Brand': product.brand || 'Tijarah Premium',
                'Warranty': '1 Year',
                'Material': 'Premium',
                'Rating': `${product.rating || 4.8}/5`,
              }).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                  <span className="text-slate-400 font-bold text-sm uppercase">{key}</span>
                  <span className="text-slate-900 font-black text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .thumbs-swiper .swiper-slide-thumb-active {
          border-color: #1e40af;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 20px !important;
        }
        .swiper-button-next, .swiper-button-prev {
          background: white;
          width: 44px !important;
          height: 44px !important;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          color: #1e40af !important;
        }
      `}</style>
    </div>
  );
}