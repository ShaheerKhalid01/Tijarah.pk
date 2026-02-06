const createNextIntlConfig = require('next-intl').createNextIntlConfig;

const nextIntlConfig = createNextIntlConfig({
  // List of all locales that should be supported
  locales: ['en', 'ur', 'zh', 'tr', 'ms', 'id'],
  
  // Default locale to use when visiting a non-locale prefixed path
  defaultLocale: 'en',
  
  // Enable automatic locale detection
  localeDetection: true,
  
  // Path to the messages directory
  messagesDir: './messages',
  
  // Default locale to use when a user's preferred locale is not available
  fallbackLocale: 'en',
  
  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
});

module.exports = nextIntlConfig;
