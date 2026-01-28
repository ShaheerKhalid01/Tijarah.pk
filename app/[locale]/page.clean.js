'use client';

import { useParams } from 'next/navigation';

export default function LocaleHomePage() {
  const { locale } = useParams();
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Tijarah.pk
          </h1>
          <p className="text-xl text-gray-600">
            Current locale: <span className="font-semibold">{locale}</span>
          </p>
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-700 mb-4">
              This is a clean starting point for your localized homepage.
            </p>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                You can start adding your components and content here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
