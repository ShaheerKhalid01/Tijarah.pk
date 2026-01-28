// app/[locale]/IntlProvider.js
'use client';

import { NextIntlClientProvider } from 'next-intl';

export default function IntlProvider({ locale, messages, children }) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Asia/Karachi"
      defaultTranslationValues={{
        strong: (chunks) => <strong>{chunks}</strong>,
        em: (chunks) => <em>{chunks}</em>,
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}