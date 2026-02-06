import ClientLayout from '../client-layout';

// ✅ OPTIMIZED: Memoize static params
const SUPPORTED_LOCALES = ['en', 'ur', 'zh', 'tr', 'ms', 'id'];

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

// ✅ OPTIMIZED: Cache messages at build time
const messagesCache = new Map();

async function getMessages(locale) {
  // ✅ Check cache first
  if (messagesCache.has(locale)) {
    return messagesCache.get(locale);
  }

  try {
    // ✅ Dynamic import with better error handling
    const messages = (await import(`../../messages/${locale}.json`, {
      assert: { type: 'json' }
    })).default;
    
    // ✅ Cache for subsequent requests
    messagesCache.set(locale, messages);
    return messages;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    
    // ✅ Fallback to English if available
    if (locale !== 'en') {
      try {
        const fallbackMessages = (await import(`../../messages/en.json`, {
          assert: { type: 'json' }
        })).default;
        messagesCache.set(locale, fallbackMessages);
        return fallbackMessages;
      } catch (fallbackError) {
        console.error('Failed to load fallback English messages', fallbackError);
      }
    }
    
    return {};
  }
}

// ✅ OPTIMIZED: Add caching headers
export const revalidate = 3600; // Cache for 1 hour (ISR)

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  
  return {
    description: messages.siteDescription || 'Tijarah.pk - Buy and Sell Online',
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // ✅ OPTIMIZED: Validate locale
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.warn(`Unsupported locale: ${locale}, defaulting to English`);
  }

  // ✅ OPTIMIZED: Get cached messages
  const messages = await getMessages(locale);

  return (
    <ClientLayout locale={locale} messages={messages}>
      {children}
    </ClientLayout>
  );
}