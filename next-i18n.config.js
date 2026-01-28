/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'ar', 'ur', 'zh', 'tr', 'ms', 'id'],
    defaultLocale: 'en',
    localeDetection: true,
  },
};

module.exports = nextConfig;
