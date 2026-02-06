'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useRef, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// ✅ FIXED: Memoized button component
const NavButton = memo(({ direction, buttonRef, ariaLabel }) => {
    const baseClasses = "absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm";
    const positionClasses = direction === 'prev' ? 'left-4 md:left-8' : 'right-4 md:right-8';

    const SVGIcon = direction === 'prev' ? (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    ) : (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );

    return (
        <button
            ref={buttonRef}
            className={`${baseClasses} ${positionClasses}`}
            aria-label={ariaLabel}
            type="button"
        >
            {SVGIcon}
        </button>
    );
});

NavButton.displayName = 'NavButton';

// ✅ FIXED: Memoized slide content - NO INLINE STYLES
const SlideContent = memo(({ slide, locale }) => {
    const buttonConfig = useMemo(() => {
        const configs = {
            1: { href: `/${locale}/special-offers`, text: 'View Special Offers', color: 'bg-blue-600 hover:bg-blue-700' },
            2: { href: `/${locale}/new-arrivals`, text: 'View New Arrivals', color: 'bg-purple-600 hover:bg-purple-700' },
            3: { href: `/${locale}/Good-deals`, text: 'View Good Deals', color: 'bg-red-600 hover:bg-red-700' },
        };
        return configs[slide.id] || { href: '#', text: 'Shop Now', color: 'bg-blue-600 hover:bg-blue-700' };
    }, [slide.id, locale]);

    const commonButtonClasses = "inline-block text-white font-semibold py-3 px-8 text-lg md:text-xl rounded-full transition-all active:scale-95 transform hover:scale-105 shadow-lg hover:shadow-xl";

    return (
        <>
            {/* ✅ FIXED: No inline styles - use only classes */}
            {/* ✅ FIXED: Use bg-linear-to-r for Tailwind v4 compatibility */}
            <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/30 z-10 flex items-center justify-center text-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                <div className="max-w-4xl mx-auto">
                    {/* ✅ FIXED: No inline style on h2 - use only classes */}
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-6 leading-tight tracking-tight drop-shadow-xl font-[900]">
                        {slide.title}
                    </h2>

                    {/* ✅ FIXED: No inline style on p - use only classes */}
                    <p className="text-lg md:text-2xl lg:text-3xl mb-6 md:mb-8 text-gray-100 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                        {slide.description}
                    </p>

                    {slide.id <= 3 ? (
                        <Link
                            href={buttonConfig.href}
                            className={`${commonButtonClasses} ${buttonConfig.color}`}
                        >
                            {slide.buttonText || buttonConfig.text}
                        </Link>
                    ) : (
                        <button
                            className={`${commonButtonClasses} bg-blue-600 hover:bg-blue-700`}
                            type="button"
                        >
                            {slide.buttonText || 'Shop Now'}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
});

SlideContent.displayName = 'SlideContent';

// ✅ FIXED: Main carousel component - CLIENT ONLY
const ImageCarouselClient = ({ slides = [], locale = 'en' }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const swiperRef = useRef(null);

    // ✅ Memoize autoplay config
    const autoplayConfig = useMemo(() => ({
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
    }), []);

    // ✅ Memoize pagination config
    const paginationConfig = useMemo(() => ({
        clickable: true,
    }), []);

    // ✅ Memoize navigation config
    const navigationConfig = useMemo(() => ({
        prevEl: prevRef.current,
        nextEl: nextRef.current,
    }), []);

    // ✅ Memoize on before init callback
    const handleBeforeInit = useCallback((swiper) => {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
    }, []);

    return (
        <div className="w-full h-[450px] md:h-[600px] lg:h-[700px] relative overflow-hidden group">
            <Swiper
                ref={swiperRef}
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                speed={600}
                autoplay={autoplayConfig}
                pagination={paginationConfig}
                navigation={navigationConfig}
                onBeforeInit={handleBeforeInit}
                className="w-full h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={`slide-${slide.id}`} data-swiper-autoplay={slide.delay}>
                        <div className="relative w-full h-full">
                            <SlideContent slide={slide} locale={locale} />

                            {/* ✅ FIXED: Image with all explicit attributes */}
                            <Image
                                src={slide.image}
                                alt={slide.alt || `Slide ${index + 1}`}
                                fill
                                priority={slide.id === 1}
                                className="object-cover"
                                sizes="100vw"
                                quality={75}
                            />
                        </div>
                    </SwiperSlide>
                ))}

                {/* Navigation Buttons */}
                <NavButton direction="prev" buttonRef={prevRef} ariaLabel="Previous slide" />
                <NavButton direction="next" buttonRef={nextRef} ariaLabel="Next slide" />
            </Swiper>
        </div>
    );
};

export default ImageCarouselClient;
