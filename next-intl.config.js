/** @type {import('next-intl').createRequestConfig} */
const config = {
  // A list of all locales that are supported
  locales: ['en', 'ar', 'ur', 'zh', 'tr', 'ms', 'id'],
  
  // The default locale to use when visiting a non-locale prefixed path
  defaultLocale: 'en',
  
  // Directory where translation files are stored
  messagesDir: './messages',
  
  // Default locale to use when a user's preferred locale is not available
  fallbackLocale: 'en',
  
  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Configure the routing strategy
  routing: {
    // Use the pathname as the source of truth for the locale
    localePrefix: 'as-needed',
    // Redirect to the default locale when the locale is not in the path
    localeSuffix: 'as-needed'
  }
};

module.exports = config;
