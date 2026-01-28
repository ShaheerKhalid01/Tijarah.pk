'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientLayoutWrapper({ children, locale }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Redirect root path to default locale
    if (pathname === '/') {
      router.push(`/${locale}`);
    }
  }, [pathname, router, locale]);

  return children;
}
