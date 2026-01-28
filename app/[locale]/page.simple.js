'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function HomePage() {
  const params = useParams();
  const { locale } = params;
  const t = useTranslations('home');
  
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('welcome_to_tijarah') || 'Welcome to Tijarah'}
        </h1>
        <p className="text-xl text-gray-600">
          {t('your_one_stop_shop') || 'Your one-stop shop for all your needs'}
        </p>
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <p className="text-lg">
            Current locale: <span className="font-semibold">{locale}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
