// app/[locale]/generateStaticParams.js
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ur' },
    { locale: 'zh' },
    { locale: 'tr' },
    { locale: 'ms' },
    { locale: 'id' }
  ];
}