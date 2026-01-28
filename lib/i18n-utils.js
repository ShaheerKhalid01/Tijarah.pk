// This file contains utility functions for i18n message loading

// Messages will be loaded at runtime
const messagesMap = {};

export async function getMessages(locale) {
  // If we already loaded the messages, return them
  if (messagesMap[locale]) {
    return messagesMap[locale];
  }

  try {
    // Dynamic import of the messages file
    const messages = await import(`@/messages/${locale}.json`);
    // Cache the messages
    messagesMap[locale] = messages.default || messages;
    return messagesMap[locale];
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {};
  }
}

export function getAvailableLocales() {
  // This is a static list of supported locales
  return ['en', 'ar', 'ur', 'zh', 'tr', 'ms', 'id'];
}
