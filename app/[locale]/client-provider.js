'use client';

import { NextIntlClientProvider } from 'next-intl';

export default function ClientProvider({ locale, messages, children }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
