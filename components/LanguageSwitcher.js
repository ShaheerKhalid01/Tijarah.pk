'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  const changeLanguage = (newLocale) => {
    // Remove current locale from pathname
    const segments = pathname.split('/');
    if (segments.length > 1 && ['en', 'ar', 'ur', 'zh', 'tr', 'ms', 'id'].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className="flex space-x-2">
      <button 
        onClick={() => changeLanguage('en')} 
        className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('ar')}
        className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
      >
        عربي
      </button>
    </div>
  );
}
