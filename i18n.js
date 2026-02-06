// i18n.js
const path = require('path');

module.exports = {
  locales: ['en', 'ur', 'zh', 'tr', 'ms', 'id'],
  defaultLocale: 'en',
  localeDetection: true,
  localePath: path.resolve('./messages')
};