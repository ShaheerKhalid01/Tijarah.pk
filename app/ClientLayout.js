'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're at the root path
    if (pathname === '/') {
      router.push('/en');
    }
  }, [pathname, router]);

  // Don't render anything during redirection
  if (pathname === '/') {
    return null;
  }

  return children;
}
