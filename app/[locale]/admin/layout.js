import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { locales, defaultLocale } from '../../../config/locales.js';
import LocaleLayoutClient from '../LocaleLayoutClient';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  // Load messages
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <LocaleLayoutClient locale={locale} messages={messages}>
      {children}
    </LocaleLayoutClient>
  );
}

export const metadata = {
  title: 'Tijarah.pk - Your Online Shopping Destination',
  description: 'Shop the latest products at the best prices',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}