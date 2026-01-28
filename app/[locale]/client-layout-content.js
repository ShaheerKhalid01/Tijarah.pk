'use client';

import ClientLayout from './client-layout';
import { Inter } from 'next/font/google';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayoutContent({ children, params }) {
  const [isClient, setIsClient] = useState(false);
  const { locale = 'en' } = params || {};
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <ClientLayout params={params}>
      {children}
    </ClientLayout>
  );
}
