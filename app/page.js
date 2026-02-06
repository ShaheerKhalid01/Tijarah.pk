'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ✅ OPTIMIZED: Extract LoadingSpinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
      <p className="mt-4 text-gray-600">Loading Tijarah.pk...</p>
    </div>
  </div>
);

export default function RootPage() {
  const router = useRouter();

  // ✅ OPTIMIZED: Redirect on mount with stable dependency
  useEffect(() => {
    router.replace('/en');
  }, [router]);

  return <LoadingSpinner />;
}