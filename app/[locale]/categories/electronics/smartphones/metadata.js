export async function generateMetadata({ params }) {
  const { locale } = await params;
  // In a real app, you might want to fetch category-specific metadata from an API
  return {
    title: 'Smartphones - Tijarah.pk',
    description: 'Browse our wide selection of smartphones from top brands at the best prices.',
    openGraph: {
      title: 'Smartphones - Tijarah.pk',
      description: 'Browse our wide selection of smartphones from top brands at the best prices.',
      url: `https://tijarah.pk/${locale}/categories/smartphones`,
      siteName: 'Tijarah.pk',
      images: [
        {
          url: 'https://tijarah.pk/og-smartphones.jpg',
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Smartphones - Tijarah.pk',
      description: 'Browse our wide selection of smartphones from top brands at the best prices.',
      images: ['https://tijarah.pk/og-smartphones.jpg'],
    },
  };
}
