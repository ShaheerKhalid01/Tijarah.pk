'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Recommendations from '@/components/Recommendations';
import RecommendationWidget from '@/components/RecommendationWidget';

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === 'loading' || !mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Personalized Recommendations
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to see products recommended just for you
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personalized Recommendations
          </h1>
          <p className="text-gray-600">
            Discover products tailored to your preferences and shopping behavior
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Recommendations */}
          <div className="lg:col-span-3">
            <Recommendations 
              userId={session.user.id} 
              limit={12}
              title="Recommended for You"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Widget */}
            <RecommendationWidget 
              userId={session.user.id} 
              limit={3}
              compact={true}
            />

            {/* How it works */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">How Recommendations Work</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-1.5"></div>
                  <p>We analyze your browsing and purchase history</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-1.5"></div>
                  <p>Find users with similar tastes</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-1.5"></div>
                  <p>Suggest products you might like</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-1.5"></div>
                  <p>Improve over time as you shop more</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3 text-blue-900">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Rate products you've purchased</li>
                <li>• Add items to your wishlist</li>
                <li>• Browse categories you're interested in</li>
                <li>• The more you interact, the better recommendations get</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
