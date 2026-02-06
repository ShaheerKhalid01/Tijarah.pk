// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from './contexts/NotificationContext';

// ✅ OPTIMIZED: Font configuration with optimal settings
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // ✅ CSS variable for font usage
  weight: ['400', '500', '600', '700'], // ✅ Only preload needed weights
  display: 'swap', // ✅ Swap text while font loads (no FOIT)
  preload: true, // ✅ Preload font for faster loading
});

// ✅ OPTIMIZED: Metadata configuration
export const metadata = {
  title: 'Tijarah.pk',
  description: 'Your marketplace platform',
  // ✅ Add Open Graph metadata for better social sharing
  openGraph: {
    title: 'Tijarah.pk',
    description: 'Your marketplace platform',
    url: 'https://tijarah.pk',
    siteName: 'Tijarah.pk',
    locale: 'en_US',
    type: 'website',
  },
  // ✅ Add Twitter Card for social sharing
  twitter: {
    card: 'summary_large_image',
    title: 'Tijarah.pk',
    description: 'Your marketplace platform',
  },
  // ✅ Add robots metadata for SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // ✅ Add icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// ✅ OPTIMIZED: Generate viewport metadata
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // ✅ Add language attribute for accessibility
      suppressHydrationWarning={true}
    // ✅ Suppress hydration warning for dynamic content
    >
      <head>
        {/* ✅ Add preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ✅ Add DNS prefetch for third-party services */}
        <link rel="dns-prefetch" href="https://api.example.com" />

        {/* ✅ Add meta charset for proper text encoding */}
        <meta charSet="utf-8" />
      </head>
      <body
        className={inter.variable}
      // ✅ Use CSS variable instead of className for better performance
      // This allows CSS to use: font-family: var(--font-inter)
      >
        {/* ✅ Wrap providers at top level */}
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}