// hooks/useSafeTranslations.js
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export function useSafeTranslations(namespace) {
  const [isReady, setIsReady] = useState(false);
  const t = useTranslations(namespace);

  useEffect(() => {
    // Mark translations as ready after component mounts
    setIsReady(true);
  }, []);

  // Return a safe translation function that provides fallbacks
  const safeT = (key, fallback) => {
    if (!isReady) return fallback || key;
    
    try {
      const result = t(key);
      return result || fallback || key;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return fallback || key;
    }
  };

  return { t: safeT, isReady };
}
