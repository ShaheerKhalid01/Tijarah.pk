'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import CategoryProducts from '@/app/components/CategoryProducts';

export default function CategoryPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const category = params?.category;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const validCategories = ['electronics', 'fashion', 'home-kitchen', 'beauty', 'sports-outdoors', 'books-media', 'toys-games', 'grocery'];

  useEffect(() => {
    if (!category) return;

    if (!validCategories.includes(category)) {
      setError('Category not found');
      setLoading(false);
      return;
    }

    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/category/${category}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.details || errorData.error || 'Failed to fetch products');
        }

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Invalid JSON response:', text.substring(0, 200));
          // If we can't parse the response, throw a specific error
          throw new Error('Server returned invalid response');
        }
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const formatCategoryName = (cat) => {
    if (!cat) return '';
    return cat
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error === 'Category not found') {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {formatCategoryName(category)}
        </h1>
        <p className="text-gray-600">
          Discover our collection of {formatCategoryName(category)} products.
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          {error}
        </div>
      ) : (
        <CategoryProducts
          products={products}
          categoryName={formatCategoryName(category)}
        />
      )}
    </div>
  );
}
