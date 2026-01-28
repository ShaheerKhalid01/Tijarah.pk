// app/[locale]/generateMetadata.js
const locales = ['en', 'ar', 'ur', 'zh', 'tr', 'ms', 'id'];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: {
      template: '%s | Tijarah.pk',
      default: 'Tijarah.pk - Your Ultimate Shopping Destination',
    },
    description: 'Discover amazing products at the best prices on Tijarah.pk',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    alternates: {
      canonical: './',
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `/${loc}`])
      ),
    },
    openGraph: {
      title: 'Tijarah.pk - Your Ultimate Shopping Destination',
      description: 'Discover amazing products at the best prices on Tijarah.pk',
      url: `/${locale}`,
      siteName: 'Tijarah.pk',
      locale,
      type: 'website',
    },
  };
}