'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import CategoryProducts from '@/app/components/CategoryProducts';

// ✅ OPTIMIZED: Move constants outside component
const VALID_CATEGORIES = [
  'electronics',
  'fashion',
  'home-kitchen',
  'beauty',
  'sports-outdoors',
  'books-media',
  'toys-games',
  'grocery'
];

// ✅ OPTIMIZED: Memoized loading skeleton
const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
  </div>
);

// ✅ OPTIMIZED: Memoized error message component
const ErrorMessage = ({ error, onClearError }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
    <p>{error}</p>
    {onClearError && (
      <button
        onClick={onClearError}
        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        type="button"
      >
        Dismiss
      </button>
    )}
  </div>
);

// ✅ OPTIMIZED: Memoized category header
const CategoryHeader = ({ categoryName }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold mb-2">
      {categoryName}
    </h1>
    <p className="text-gray-600">
      Discover our collection of {categoryName} products.
    </p>
  </div>
);

export default function CategoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSkeleton />}>
        <CategoryPageContent />
      </Suspense>
    </div>
  );
}

function CategoryPageContent() {
  const params = useParams();
  const locale = useMemo(() => params?.locale || 'en', [params?.locale]);
  const category = useMemo(() => params?.category, [params?.category]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isValidCategory = useMemo(() =>
    category && VALID_CATEGORIES.includes(category),
    [category]
  );

  const formattedCategoryName = useMemo(() => {
    if (!category) return '';
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [category]);

  const parseJsonResponse = useCallback((text) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON response:', text.substring(0, 200));
      throw new Error('Server returned invalid response');
    }
  }, []);

  const fetchCategoryProducts = useCallback(async () => {
    if (!category || !isValidCategory) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/category/${category}`, {
        next: { revalidate: 3600 }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || `Failed to fetch products (${response.status})`
        );
      }

      const text = await response.text();
      const data = parseJsonResponse(text);

      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.error('Error fetching category products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, isValidCategory, parseJsonResponse]);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    if (!isValidCategory) {
      setError('Category not found');
      setLoading(false);
      return;
    }

    fetchCategoryProducts();
  }, [category, isValidCategory, fetchCategoryProducts]);

  if (!loading && error === 'Category not found') {
    notFound();
  }

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <CategoryHeader categoryName={formattedCategoryName} />

      {error ? (
        <ErrorMessage
          error={error}
          onClearError={() => setError(null)}
        />
      ) : (
        <CategoryProducts
          products={products}
          categoryName={formattedCategoryName}
          locale={locale}
        />
      )}
    </>
  );
}
