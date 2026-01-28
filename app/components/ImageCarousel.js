'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ImageCarousel = ({ slides = [], locale = 'en' }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="w-full h-[450px] md:h-[600px] lg:h-[700px] relative overflow-hidden group">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={600} // Speed of the sliding animation (Rapid)
        autoplay={{
          delay: 2000, // Default fallback delay
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          /* data-swiper-autoplay handles the specific timing for each slide */
          <SwiperSlide key={slide.id} data-swiper-autoplay={slide.delay}>
            <div className="relative w-full h-full">
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/30 z-10 flex items-center justify-center text-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-6 leading-tight tracking-tight drop-shadow-xl" 
                      style={{
                        fontVariationSettings: '"wght" 900',
                        fontFamily: 'var(--font-inter), sans-serif',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                      }}>
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-2xl lg:text-3xl mb-6 md:mb-8 text-gray-100 font-medium max-w-3xl mx-auto leading-relaxed"
                     style={{
                       textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                       fontFamily: 'var(--font-inter), sans-serif'
                     }}>
                    {slide.description}
                  </p>
                  {slide.id === 1 ? (
                    <Link 
                      href={`/${locale}/special-offers`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 text-lg md:text-xl rounded-full transition-all active:scale-95 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        letterSpacing: '0.02em',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      {slide.buttonText || 'View Special Offers'}
                    </Link>
                  ) : slide.id === 2 ? (
                    <Link 
                      href={`/${locale}/new-arrivals`}
                      className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 text-lg md:text-xl rounded-full transition-all active:scale-95 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        letterSpacing: '0.02em',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      {slide.buttonText || 'View New Arrivals'}
                    </Link>
                  ) : slide.id === 3 ? (
                    <Link 
                      href={`/${locale}/Good-deals`}
                      className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 text-lg md:text-xl rounded-full transition-all active:scale-95 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        letterSpacing: '0.02em',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      {slide.buttonText || 'View Good Deals'}
                    </Link>
                  ) : (
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 text-lg md:text-xl rounded-full transition-all active:scale-95 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        letterSpacing: '0.02em',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      {slide.buttonText || 'Shop Now'}
                    </button>
                  )}
                </div>
              </div>

              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={slide.id === 1}
                className="object-cover"
                sizes="100vw"
                quality={90}
              />
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <button 
          ref={prevRef} 
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          ref={nextRef} 
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Swiper>
    </div>
  );
};

export default ImageCarousel;