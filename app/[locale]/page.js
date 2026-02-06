'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { lazy, Suspense } from 'react';
import CategoryCard from '../components/CategoryCard';
import ImageCarousel from '../components/ImageCarousel';

// Lazy load heavy components with loading boundaries
const ProductShelf = dynamic(() => import('../components/ProductShelf'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />,
  ssr: true
});

// Image constants with smaller/optimized initial images
const UNSLASH_CATEGORY_IMAGES = {
  smartphones: 'https://images.unsplash.com/photo-1672413514634-4781b15fd89e?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  tablets: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  accessories: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'smart-watch': 'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'mens-fashion': 'https://images.unsplash.com/photo-1767780441286-7ec28fc382e2?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'womens-fashion': 'https://images.unsplash.com/photo-1584339312444-6952d098e152?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'kids-fashion': 'https://images.unsplash.com/photo-1712803092319-2b861dfa243f?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'fashion-accessories': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  decor: 'https://images.unsplash.com/photo-1725207829722-abec8c43bc8d?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  garden: 'https://images.unsplash.com/photo-1695060476278-0d64aea269aa?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  skincare: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  makeup: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  fragrances: 'https://images.unsplash.com/photo-1659450013573-b2d6b39f916a?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'hair-care': 'https://images.unsplash.com/photo-1643837833100-8b2ebd7127bc?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  fitness: 'https://images.unsplash.com/photo-1627257058769-0a99529e4312?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  camping: 'https://images.unsplash.com/photo-1625013964767-0e4b3c041607?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'team-sports': 'https://images.unsplash.com/photo-1520399636535-24741e71b160?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  outdoor: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'educational-toys': 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'board-games': 'https://images.unsplash.com/photo-1629760946220-5693ee4c46ac?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  puzzles: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=400&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
};

const UNSLASH_PRODUCT_IMAGES = {
  'smartphone-pro': 'https://images.unsplash.com/photo-1652352545956-34c26af007da?w=300&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'wireless-earbuds': 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'smart-watch': 'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?w=300&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'laptop-ultra': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'mens-shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'womens-dress': 'https://images.unsplash.com/photo-1522219406764-db207f1f7640?w=300&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'running-shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
  'designer-handbag': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&auto=format&fit=crop&q=40&ixlib=rb-4.1.0',
};

// ✅ OPTIMIZED: Memoized category data to prevent re-renders
const CATEGORY_DATA = [
  {
    id: 'electronics',
    title: 'electronics',
    items: [
      { label: 'smartphones', href: '/categories/electronics/smartphones', image: UNSLASH_CATEGORY_IMAGES.smartphones },
      { label: 'laptops', href: '/categories/electronics/laptops', image: UNSLASH_CATEGORY_IMAGES.laptops },
      { label: 'tablets', href: '/categories/electronics/tablets', image: UNSLASH_CATEGORY_IMAGES.tablets },
      { label: 'smartwatches', href: '/categories/electronics/smartwatches', image: UNSLASH_CATEGORY_IMAGES['smart-watch'] },
    ],
    footerLabel: 'view_all_electronics',
    footerHref: '/categories/electronics',
  },
  {
    id: 'fashion',
    title: 'fashion',
    items: [
      { label: 'mens_fashion', image: UNSLASH_CATEGORY_IMAGES['mens-fashion'] },
      { label: 'womens_fashion', image: UNSLASH_CATEGORY_IMAGES['womens-fashion'] },
      { label: 'kids_fashion', image: UNSLASH_CATEGORY_IMAGES['kids-fashion'] },
      { label: 'fashion_accessories', image: UNSLASH_CATEGORY_IMAGES['fashion-accessories'] },
    ],
    footerLabel: 'view_all_fashion',
    footerHref: '/categories/fashion',
  },
  {
    id: 'home-garden',
    title: 'home_garden',
    items: [
      { label: 'furniture', image: UNSLASH_CATEGORY_IMAGES.furniture },
      { label: 'decor', image: UNSLASH_CATEGORY_IMAGES.decor },
      { label: 'kitchen', image: UNSLASH_CATEGORY_IMAGES.kitchen },
      { label: 'garden', image: UNSLASH_CATEGORY_IMAGES.garden },
    ],
    footerLabel: 'view_all_home',
    footerHref: '/categories/home-kitchen',
  },
];

const CATEGORY_DATA_2 = [
  {
    id: 'beauty',
    title: 'beauty_personal_care',
    items: [
      { label: 'skincare', image: UNSLASH_CATEGORY_IMAGES.skincare },
      { label: 'makeup', image: UNSLASH_CATEGORY_IMAGES.makeup },
      { label: 'fragrances', image: UNSLASH_CATEGORY_IMAGES.fragrances },
      { label: 'hair_care', image: UNSLASH_CATEGORY_IMAGES['hair-care'] },
    ],
    footerLabel: 'view_all_beauty',
    footerHref: '/categories/beauty',
  },
  {
    id: 'sports',
    title: 'sports_outdoors',
    items: [
      { label: 'fitness_equipment', image: UNSLASH_CATEGORY_IMAGES.fitness },
      { label: 'camping_gear', image: UNSLASH_CATEGORY_IMAGES.camping },
      { label: 'team_sports', image: UNSLASH_CATEGORY_IMAGES['team-sports'] },
      { label: 'outdoor_recreation', image: UNSLASH_CATEGORY_IMAGES.outdoor },
    ],
    footerLabel: 'view_all_sports',
    footerHref: '/categories/sports-outdoor',
  },
  {
    id: 'toys',
    title: 'toys_games',
    items: [
      { label: 'educational_toys', image: UNSLASH_CATEGORY_IMAGES['educational-toys'] },
      { label: 'board_games', image: UNSLASH_CATEGORY_IMAGES['board-games'] },
      { label: 'puzzles', image: UNSLASH_CATEGORY_IMAGES.puzzles },
    ],
    footerLabel: 'view_all_toys',
    footerHref: '/categories/toys-games',
  },
];

const FEATURED_PRODUCTS = [
  {
    id: 'smartphone-pro',
    name: 'smartphone_pro',
    price: 899.99,
    rating: 4.5,
    image: UNSLASH_PRODUCT_IMAGES['smartphone-pro'],
  },
  {
    id: 'wireless-earbuds',
    name: 'wireless_earbuds',
    price: 129.99,
    rating: 4.2,
    image: UNSLASH_PRODUCT_IMAGES['wireless-earbuds'],
  },
  {
    id: 'smart-watch',
    name: 'smart_watch',
    price: 249.99,
    rating: 4.7,
    image: UNSLASH_PRODUCT_IMAGES['smart-watch'],
  },
  {
    id: 'laptop-ultra',
    name: 'laptop_ultra',
    price: 1299.99,
    rating: 4.8,
    image: UNSLASH_PRODUCT_IMAGES['laptop-ultra'],
  }
];

const FASHION_PRODUCTS = [
  {
    id: 'mens-shirt',
    name: 'mens_shirt',
    price: 39.99,
    rating: 4.3,
    image: UNSLASH_PRODUCT_IMAGES['mens-shirt'],
  },
  {
    id: 'womens-dress',
    name: 'womens_dress',
    price: 59.99,
    rating: 4.5,
    image: UNSLASH_PRODUCT_IMAGES['womens-dress'],
  },
  {
    id: 'running-shoes',
    name: 'running_shoes',
    price: 89.99,
    rating: 4.7,
    image: UNSLASH_PRODUCT_IMAGES['running-shoes'],
  },
  {
    id: 'designer-handbag',
    name: 'designer_handbag',
    price: 199.99,
    rating: 4.6,
    image: UNSLASH_PRODUCT_IMAGES['designer-handbag'],
  }
];

// ✅ OPTIMIZED: Lazy load second product shelf
const SecondProductShelf = dynamic(() => import('../components/ProductShelf'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />,
  ssr: true
});

export default function LocaleHomePage() {
  const { locale } = useParams();
  const t = useTranslations('home');

  // Memoized carousel slides
  const carouselSlides = [
    {
      id: 1,
      image: '/banner1.png',
      alt: t('carousel.slide1.title'),
      title: t('carousel.slide1.title'),
      description: t('carousel.slide1.description'),
      buttonText: t('carousel.slide1.buttonText'),
      delay: 7000,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=500&fit=crop&q=40',
      alt: t('carousel.slide2.title'),
      title: t('carousel.slide2.title'),
      description: t('carousel.slide2.description'),
      buttonText: t('carousel.slide2.buttonText'),
      delay: 4000,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=500&fit=crop&q=40',
      alt: t('carousel.slide3.title'),
      title: t('carousel.slide3.title'),
      description: t('carousel.slide3.description'),
      buttonText: t('carousel.slide3.buttonText'),
      delay: 4000,
    },
  ];

  // Helper to build category items with locale
  const buildCategoryItems = (categoryData) => {
    return categoryData.map(cat => ({
      ...cat,
      items: cat.items.map(item => ({
        ...item,
        href: item.href ? `/${locale}${item.href}` : undefined,
      })),
      footerHref: `/${locale}${cat.footerHref}`,
    }));
  };

  const categoriesRow1 = buildCategoryItems(CATEGORY_DATA);
  const categoriesRow2 = buildCategoryItems(CATEGORY_DATA_2);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Image Carousel - Critical above fold */}
      <div className="w-full">
        <ImageCarousel slides={carouselSlides} locale={locale} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* First Row of Category Cards - Fast Load */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {categoriesRow1.map((category) => (
            <CategoryCard
              key={category.id}
              title={t(category.title)}
              items={category.items.map(item => ({
                label: t(item.label),
                href: item.href,
                image: item.image,
                alt: t(item.label)
              }))}
              footerLabel={t(category.footerLabel)}
              footerHref={category.footerHref}
            />
          ))}
        </div>

        {/* Second Row of Category Cards - Lazy Load */}
        <Suspense fallback={<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {[1, 2, 3].map(i => <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />)}
        </div>}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {categoriesRow2.map((category) => (
              <CategoryCard
                key={category.id}
                title={t(category.title)}
                items={category.items.map(item => ({
                  label: t(item.label),
                  href: item.href,
                  image: item.image,
                  alt: t(item.label)
                }))}
                footerLabel={t(category.footerLabel)}
                footerHref={category.footerHref}
              />
            ))}
          </div>
        </Suspense>
      </div>

      {/* Featured Products Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              {t('featured_products')}
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              {t('browse_our_collection')}
            </p>
          </div>

          {/* First Product Shelf - Critical Content */}
          <div className="mb-16">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {t('trending_now')}
              </h3>
              <p className="text-lg text-gray-500">
                {t('trending_now_description', 'Check out what\'s popular right now')}
              </p>
            </div>
            <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse rounded-lg" />}>
              <ProductShelf
                products={FEATURED_PRODUCTS.map(p => ({
                  ...p,
                  name: t(p.name),
                }))}
              />
            </Suspense>
          </div>

          {/* Second Product Shelf - Lazy Load */}
          <div className="mt-16">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {t('fashion_collection')}
              </h3>
              <p className="text-lg text-gray-500">
                {t('latest_fashion_trends')}
              </p>
            </div>
            <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse rounded-lg" />}>
              <SecondProductShelf
                products={FASHION_PRODUCTS.map(p => ({
                  ...p,
                  name: t(p.name),
                }))}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}