'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CategoryCard from '../components/CategoryCard';
import ProductShelf from '../components/ProductShelf';
import ImageCarousel from '../components/ImageCarousel';

// Image constants
const UNSLASH_CATEGORY_IMAGES = {
  smartphones: 'https://images.unsplash.com/photo-1672413514634-4781b15fd89e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZXN8ZW58MHx8MHx8fDA%3D',
  laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
  tablets: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  'smart-watch': 'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D',
  'mens-fashion': 'https://images.unsplash.com/photo-1767780441286-7ec28fc382e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVucyUyMGZhc2hpb24lMjBpc2xhbWljfGVufDB8fDB8fHww',
  'womens-fashion': 'https://images.unsplash.com/photo-1584339312444-6952d098e152?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d29tZW5zJTIwZmFzaGlvbiUyMGlzbGFtaWN8ZW58MHx8MHx8fDA%3D',
  'kids-fashion': 'https://images.unsplash.com/photo-1712803092319-2b861dfa243f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8a2lkcyUyMGZhc2hpb24lMjBpc2xhbWljfGVufDB8fDB8fHww',
  'fashion-accessories': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
  decor: 'https://images.unsplash.com/photo-1725207829722-abec8c43bc8d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVjb3IlMjBpc2xhbWljfGVufDB8fDB8fHww',
  kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D',
  garden: 'https://images.unsplash.com/photo-1695060476278-0d64aea269aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyZGVuJTIwaXNsYW1pY3xlbnwwfHwwfHx8MA%3D%3D',
  skincare: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
  makeup: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFrZXVwfGVufDB8fDB8fHww',
  fragrances: 'https://images.unsplash.com/photo-1659450013573-b2d6b39f916a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJhZ3JhbmNlc3xlbnwwfHwwfHx8MA%3D%3D',
  'hair-care': 'https://images.unsplash.com/photo-1643837833100-8b2ebd7127bc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpciUyMGNhcmUlMjBpc2xhbWljfGVufDB8fDB8fHww',
  fitness: 'https://images.unsplash.com/photo-1627257058769-0a99529e4312?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zml0bmVzcyUyMGVxdWlwbWVudHxlbnwwfHwwfHx8MA%3D%3D',
  camping: 'https://images.unsplash.com/photo-1625013964767-0e4b3c041607?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGluZyUyMGdlYXJ8ZW58MHx8MHx8fDA%3D',
  'team-sports': 'https://images.unsplash.com/photo-1520399636535-24741e71b160?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVhbSUyMHNwb3J0c3xlbnwwfHwwfHx8MA%3D%3D',
  outdoor: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
  'educational-toys': 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWR1Y2F0aW9uYWwlMjB0b3lzfGVufDB8fDB8fHww',
  'board-games': 'https://images.unsplash.com/photo-1629760946220-5693ee4c46ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hcmQlMjBnYW1lc3xlbnwwfHwwfHx8MA%3D%3D',
  puzzles: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHV6emxlc3xlbnwwfHwwfHx8MA%3D%3D',
};

const UNSLASH_PRODUCT_IMAGES = {
  'smartphone-pro': 'https://images.unsplash.com/photo-1652352545956-34c26af007da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZSUyMHByb3xlbnwwfHwwfHx8MA%3D%3D',
  'wireless-earbuds': 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww',
  'smart-watch': 'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D',
  'laptop-ultra': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
  'mens-shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
  'womens-dress': 'https://images.unsplash.com/photo-1522219406764-db207f1f7640?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdvbWVuJ3MlMjBkcmVzcyUyMGlzbGFtaWN8ZW58MHx8MHx8fDA%3D',
  'running-shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
  'designer-handbag': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
};

export default function LocaleHomePage() {
  const { locale } = useParams();
  const t = useTranslations('home');
  const tSimple = useTranslations();

  // Carousel slides with translations
  const carouselSlides = [
    {
      id: 1,
      image: '/banner1.png',
      alt: t('carousel.slide1.title'),
      title: t('carousel.slide1.title'),
      description: t('carousel.slide1.description'),
      buttonText: t('carousel.slide1.buttonText'),
      delay: 7000, // 7 seconds for the first slide
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=500&fit=crop',
      alt: t('carousel.slide2.title'),
      title: t('carousel.slide2.title'),
      description: t('carousel.slide2.description'),
      buttonText: t('carousel.slide2.buttonText'),
      delay: 4000, // 4 seconds
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=500&fit=crop',
      alt: t('carousel.slide3.title'),
      title: t('carousel.slide3.title'),
      description: t('carousel.slide3.description'),
      buttonText: t('carousel.slide3.buttonText'),
      delay: 4000,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Image Carousel */}
      <div className="w-full">
        <ImageCarousel slides={carouselSlides} locale={locale} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* First Row of Category Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">

          {/* Category Card 1 - Electronics */}
          <CategoryCard
            title={t('electronics')}
            items={[
              {
                label: t('smartphones'),
                href: `/${locale}/categories/electronics/smartphones`,
                image: UNSLASH_CATEGORY_IMAGES.smartphones,
                alt: t('smartphones')
              },
              {
                label: t('laptops'),
                href: `/${locale}/categories/electronics/laptops`,
                image: UNSLASH_CATEGORY_IMAGES.laptops,
                alt: t('laptops')
              },
              {
                label: t('tablets'),
                href: `/${locale}/categories/electronics/tablets`,
                image: UNSLASH_CATEGORY_IMAGES.tablets,
                alt: t('tablets')
              },
              {
                label: t('smartwatches'),
                href: `/${locale}/categories/electronics/smartwatches`,
                image: UNSLASH_CATEGORY_IMAGES['smart-watch'],
                alt: t('smartwatches')
              }
            ]}
            footerLabel={t('view_all_electronics')}
            footerHref={`/${locale}/categories/electronics`}
          />

          {/* Category Card 2 - Fashion */}
          <CategoryCard
            title={t('fashion')}
            items={[
              {
                label: t('mens_fashion'),
                image: UNSLASH_CATEGORY_IMAGES['mens-fashion'],
                alt: t('mens_fashion')
              },
              {
                label: t('womens_fashion'),
                image: UNSLASH_CATEGORY_IMAGES['womens-fashion'],
                alt: t('womens_fashion')
              },
              {
                label: t('kids_fashion'),
                image: UNSLASH_CATEGORY_IMAGES['kids-fashion'],
                alt: t('kids_fashion')
              },
              {
                label: t('fashion_accessories'),
                image: UNSLASH_CATEGORY_IMAGES['fashion-accessories'],
                alt: t('fashion_accessories')
              }
            ]}
            footerLabel={t('view_all_fashion')}
            footerHref={`/${locale}/categories/fashion`}
          />

          {/* Category Card 3 - Home & Garden */}
          <CategoryCard
            title={t('home_garden')}
            items={[
              {
                label: t('furniture'),
                image: UNSLASH_CATEGORY_IMAGES.furniture,
                alt: t('furniture')
              },
              {
                label: t('decor'),
                image: UNSLASH_CATEGORY_IMAGES.decor,
                alt: t('decor')
              },
              {
                label: t('kitchen'),
                image: UNSLASH_CATEGORY_IMAGES.kitchen,
                alt: t('kitchen')
              },
              {
                label: t('garden'),
                image: UNSLASH_CATEGORY_IMAGES.garden,
                alt: t('garden')
              }
            ]}
            footerLabel={t('view_all_home')}
            footerHref={`/${locale}/categories/home-kitchen`}
          />
        </div>

        {/* Second Row of Category Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">

          {/* Category Card 4 - Beauty & Personal Care */}
          <CategoryCard
            title={t('beauty_personal_care')}
            items={[
              {
                label: t('skincare'),
                image: UNSLASH_CATEGORY_IMAGES.skincare,
                alt: t('skincare')
              },
              {
                label: t('makeup'),
                image: UNSLASH_CATEGORY_IMAGES.makeup,
                alt: t('makeup')
              },
              {
                label: t('fragrances'),
                image: UNSLASH_CATEGORY_IMAGES.fragrances,
                alt: t('fragrances')
              },
              {
                label: t('hair_care'),
                image: UNSLASH_CATEGORY_IMAGES['hair-care'],
                alt: t('hair_care')
              }
            ]}
            footerLabel={t('view_all_beauty')}
            footerHref={`/${locale}/categories/beauty`}
          />

          {/* Category Card 5 - Sports & Outdoors */}
          <CategoryCard
            title={t('sports_outdoors')}
            items={[
              {
                label: t('fitness_equipment'),
                image: UNSLASH_CATEGORY_IMAGES.fitness,
                alt: t('fitness_equipment')
              },
              {
                label: t('camping_gear'),
                image: UNSLASH_CATEGORY_IMAGES.camping,
                alt: t('camping_gear')
              },
              {
                label: t('team_sports'),
                image: UNSLASH_CATEGORY_IMAGES['team-sports'],
                alt: t('team_sports')
              },
              {
                label: t('outdoor_recreation'),
                image: UNSLASH_CATEGORY_IMAGES.outdoor,
                alt: t('outdoor_recreation')
              }
            ]}
            footerLabel={t('view_all_sports')}
            footerHref={`/${locale}/categories/sports-outdoor`}
          />

          {/* Category Card 6 - Toys & Games */}
          <CategoryCard
            title={t('toys_games')}
            items={[
              {
                label: t('educational_toys'),
                image: UNSLASH_CATEGORY_IMAGES['educational-toys'],
                alt: t('educational_toys')
              },
              {
                label: t('board_games'),
                image: UNSLASH_CATEGORY_IMAGES['board-games'],
                alt: t('board_games')
              },
              {
                label: t('puzzles'),
                image: UNSLASH_CATEGORY_IMAGES.puzzles,
                alt: t('puzzles')
              }
            ]}
            footerLabel={t('view_all_toys')}
            footerHref={`/${locale}/categories/toys-games`}
          />
        </div>
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

          {/* First Product Shelf - Trending Now */}
          <div className="mb-16">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {t('trending_now')}
              </h3>
              <p className="text-lg text-gray-500">
                {t('trending_now_description', 'Check out what\'s popular right now')}
              </p>
            </div>
            <ProductShelf
              products={[
                {
                  id: 'smartphone-pro',
                  name: t('smartphone_pro'),
                  price: 899.99,
                  rating: 4.5,
                  image: UNSLASH_PRODUCT_IMAGES['smartphone-pro'],
                },
                {
                  id: 'wireless-earbuds',
                  name: t('wireless_earbuds'),
                  price: 129.99,
                  rating: 4.2,
                  image: UNSLASH_PRODUCT_IMAGES['wireless-earbuds'],
                },
                {
                  id: 'smart-watch',
                  name: t('smart_watch'),
                  price: 249.99,
                  rating: 4.7,
                  image: UNSLASH_PRODUCT_IMAGES['smart-watch'],
                },
                {
                  id: 'laptop-ultra',
                  name: t('laptop_ultra'),
                  price: 1299.99,
                  rating: 4.8,
                  image: UNSLASH_PRODUCT_IMAGES['laptop-ultra'],
                }
              ]}
            />
          </div>

          {/* Second Product Shelf - Fashion Collection */}
          <div className="mt-16">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {t('fashion_collection')}
              </h3>
              <p className="text-lg text-gray-500">
                {t('latest_fashion_trends')}
              </p>
            </div>
            <ProductShelf
              products={[
                {
                  id: 'mens-shirt',
                  name: t('mens_shirt'),
                  price: 39.99,
                  rating: 4.3,
                  image: UNSLASH_PRODUCT_IMAGES['mens-shirt'],
                },
                {
                  id: 'womens-dress',
                  name: t('womens_dress'),
                  price: 59.99,
                  rating: 4.5,
                  image: UNSLASH_PRODUCT_IMAGES['womens-dress'],
                },
                {
                  id: 'running-shoes',
                  name: t('running_shoes'),
                  price: 89.99,
                  rating: 4.7,
                  image: UNSLASH_PRODUCT_IMAGES['running-shoes'],
                },
                {
                  id: 'designer-handbag',
                  name: t('designer_handbag'),
                  price: 199.99,
                  rating: 4.6,
                  image: UNSLASH_PRODUCT_IMAGES['designer-handbag'],
                }
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}