// app/[locale]/generateStaticParams.js
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