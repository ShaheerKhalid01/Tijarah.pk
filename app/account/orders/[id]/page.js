'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function OrderIdRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Redirecting to the localized returns-orders page as there isn't a direct [id] subpath for it in the localized version based on my search
    // Or if it should go to products, redirect there. But usually account/orders/[id] is order detail.
    // Given the current structure, /en/returns-orders is the closest.
    router.replace('/en/returns-orders');
  }, [router, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
}