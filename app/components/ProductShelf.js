'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo, memo } from 'react';

// ✅ OPTIMIZED: Memoized product card component
const ProductCard = memo(({ product, locale, index }) => {
  // ✅ Memoize star rating rendering
  const stars = useMemo(() =>
    [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-base ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
        suppressHydrationWarning
      >
        ★
      </span>
    )),
    [product.rating]
  );

  return (
    <Link href={product.url || `/${locale}/products/${product.id}`}>
      <div
        className="cursor-pointer group w-full min-w-0 transition-transform duration-300 hover:scale-105"
        suppressHydrationWarning
      >
        {/* Image Container - ✅ No inline styles */}
        <div
          className="relative bg-gray-50 rounded-xl overflow-hidden mb-4 w-full aspect-square shadow-sm transition-shadow duration-300 group-hover:shadow-md"
          suppressHydrationWarning
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority={index === 0}
            quality={75}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>

        {/* Product Info - ✅ No inline styles */}
        <h3
          className="font-medium text-base md:text-lg line-clamp-2 mb-3 text-gray-900 leading-snug transition-colors group-hover:text-blue-600 min-h-[2.8rem]"
          suppressHydrationWarning
        >
          {product.name}
        </h3>

        {/* Price Section - ✅ No inline styles */}
        <div className="flex items-center gap-3 mb-3">
          {product.price && (
            <span
              className="text-xl font-bold text-gray-900"
              suppressHydrationWarning
            >
              ${product.price.toFixed(2)}
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-base text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating Section - ✅ Memoized stars, no inline styles */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {stars}
            </div>
            <span
              className="text-xs text-gray-500"
              suppressHydrationWarning
            >
              ({product.reviewCount?.toLocaleString() || '0'})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

// ✅ OPTIMIZED: Main component
const ProductShelf = memo(({ title, products }) => {
  const { locale } = useParams();

  // ✅ Memoize title styling
  const titleClasses = useMemo(() =>
    "text-3xl md:text-4xl font-bold mb-8 text-gray-900 tracking-tight",
    []
  );

  return (
    <div className="w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-8">
      {/* ✅ FIXED: No inline styles on h2 */}
      <h2 className={titleClasses} suppressHydrationWarning>
        {title}
      </h2>

      {/* ✅ OPTIMIZED: Grid with proper spacing */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full"
        suppressHydrationWarning
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id || index}
            product={product}
            locale={locale}
            index={index}
          />
        ))}
      </div>
    </div>
  );
});

ProductShelf.displayName = 'ProductShelf';

export default ProductShelf;