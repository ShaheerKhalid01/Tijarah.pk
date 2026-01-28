'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/en/admin-auth/login');
    } else if (session && session.user.role !== 'admin') {
      router.push('/en');
    }
  }, [session, status, router]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/categories');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setCategories(data.data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(`Failed to load categories: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchCategories();
    }
  }, [session]);

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-1">{categories.length} categories in total</p>
            </div>
            <Link
              href="/en/admin/categories/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              ➕ Add Category
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              <span className="font-semibold">❌ Error:</span> {error}
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📂</div>
            <p className="text-gray-600">
              {categories.length === 0 ? 'No categories found. ' : 'No matching categories. '}
            </p>
            {categories.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Run <code className="bg-gray-200 px-2 py-1 rounded">npm run import-categories</code> to import from public/categories
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {/* Category Image */}
                <div className="bg-gray-100 h-32 flex items-center justify-center overflow-hidden">
                  {category.image && category.image !== '/images/placeholder.jpg' ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="flex items-center justify-center w-full h-full text-5xl bg-gradient-to-br from-blue-100 to-blue-50"
                    style={{ display: !category.image || category.image === '/images/placeholder.jpg' ? 'flex' : 'none' }}
                  >
                    {category.emoji || category.icon || '📂'}
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">/{category.slug}</p>
                  
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Status Badges */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {category.featured && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        ⭐ Featured
                      </span>
                    )}
                    {!category.active && (
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        🔒 Inactive
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Link
                      href={`/en/admin/categories/${category._id}/edit`}
                      className="flex-1 text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-1"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${category.name}?`)) {
                          // Add delete functionality
                          console.log('Delete:', category._id);
                        }
                      }}
                      className="flex-1 text-center text-red-600 hover:text-red-700 text-sm font-medium py-1"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}