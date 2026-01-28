'use client';

import { Inter } from 'next/font/google';
import { IntlProvider } from 'react-intl';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

// Default messages in case loading fails
const defaultMessages = {
  'products.headphones': 'Headphones',
  'products.premiumHeadphones': 'Premium Headphones'
};

export default function ClientLayout({ children, params }) {
  const { locale = 'en' } = params || {};
  const pathname = usePathname();
  const router = useRouter();
  const [messages, setMessages] = useState(defaultMessages);
  const [isLoading, setIsLoading] = useState(true);

  // Only run on client side
  useEffect(() => {
    // Redirect to default locale if no locale is specified
    if (!locale) {
      router.push(`/en${pathname}`);
      return;
    }

    // Simple message loading without async/await to avoid hydration issues
    try {
      // This will be handled by webpack's require.context at build time
      const localeMessages = require(`../../messages/${locale}.json`);
      setMessages({
        ...defaultMessages,
        ...(localeMessages.default || localeMessages)
      });
    } catch (error) {
      console.error(`Failed to load messages for locale: ${locale}`, error);
      // Use default messages if loading fails
      setMessages(defaultMessages);
    } finally {
      setIsLoading(false);
    }
  }, [locale, pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      defaultLocale="en"
      onError={(err) => {
        // Suppress missing translation messages in production
        if (process.env.NODE_ENV === 'production') return;
        console.warn(err);
      }}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </IntlProvider>
  );
}
