import ClientLayout from '../client-layout';

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ar' },
    { locale: 'ur' },
    { locale: 'zh' },
    { locale: 'tr' },
    { locale: 'ms' },
    { locale: 'id' }
  ];
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    messages = {};
  }

  return (
    <ClientLayout locale={locale} messages={messages}>
      {children}
    </ClientLayout>
  );
}