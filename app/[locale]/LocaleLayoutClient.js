// app/[locale]/LocaleLayoutClient.js
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';

export default function LocaleLayoutClient({ children, locale, messages }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}