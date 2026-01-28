'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ImageCarousel = ({ slides = [] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (swiperRef.current?.swiper) {
        swiperRef.current.swiper.destroy();
      }
    };
  }, []);

  const handleSlideClick = (slide) => {
    if (slide?.link) {
      router.push(slide.link);
    }
  };

  if (!isMounted) {
    return <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="relative w-full h-80 md:h-[32rem] lg:h-[36rem] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="w-full h-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={slide.id || index}
              className="relative w-full h-full cursor-pointer"
              onClick={() => handleSlideClick(slide)}
            >
              <img
                src={slide.image}
                alt={slide.alt || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center text-white p-6">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                <p className="text-lg md:text-xl mb-6 max-w-2xl">{slide.description}</p>
                {slide.buttonText && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (slide.link) router.push(slide.link);
                    }}
                  >
                    {slide.buttonText}
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ImageCarousel;
