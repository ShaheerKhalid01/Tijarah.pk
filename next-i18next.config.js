/** @type {import('next-i18next').UserConfig} */
const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar', 'ur', 'zh', 'tr', 'ms', 'id'],
    localeDetection: true,
  },
  fallbackLng: 'en',
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};

export default config;
