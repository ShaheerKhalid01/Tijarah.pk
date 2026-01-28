'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

// Simple HomePage component for testing
export default function HomePage() {
  const params = useParams();
  const { locale } = params;
  const t = useTranslations('home');
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('welcome_to_tijarah')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('your_one_stop_shop')}
          </p>
          <div className="mt-8">
            <p className="text-lg text-gray-700">
              Current locale: <span className="font-semibold">{locale}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
