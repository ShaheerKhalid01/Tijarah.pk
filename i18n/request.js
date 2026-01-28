// i18n/request.js
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'ar', 'ur', 'zh', 'tr', 'ms', 'id'];
const defaultLocale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the requestLocale promise
  let locale = await requestLocale;

  // Validate that the incoming locale is valid, fall back to default if not
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});