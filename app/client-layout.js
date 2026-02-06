// app/client-layout.js
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import Providers from './Providers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FooterCTA from './components/FooterCTA';
import dynamic from 'next/dynamic';
import OrderUpdateNotification from '../components/OrderUpdateNotification';
const ChatWidget = dynamic(() => import('./components/ChatWidget'), { ssr: false });

export default function ClientLayout({
  children,
  locale,
  messages
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPath = pathname?.split('/').some(segment => ['admin', 'admin-auth'].includes(segment));

  const dir = locale === 'ar' || locale === 'ur' ? 'rtl' : 'ltr';

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Asia/Karachi"
    >
      <Providers>
        <div className="flex flex-col min-h-screen bg-white">
          {!isAdminPath && <Navbar />}
          <div className="flex-grow">
            {children}
          </div>
          {!isAdminPath && (
            <>
              <FooterCTA />
              <Footer />
            </>
          )}
        </div>
        {/* Real-time order updates for all users */}
        <OrderUpdateNotification />
        <ChatWidget />
      </Providers>
    </NextIntlClientProvider>
  );
}