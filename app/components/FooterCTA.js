"use client";

import Link from 'next/link';
import { FiArrowUp } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const FooterCTA = () => {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const t = useTranslations('footer_cta');

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full font-sans bg-gradient-to-r from-blue-600 to-blue-800">
      {/* Main CTA Section */}
      <div className="py-10 px-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          {t('title')}
        </h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          {t('description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href={`/${locale}/register`} 
            className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
          >
            {t('get_started')}
          </Link>
          <Link 
            href={`/${locale}/login`} 
            className="text-white border-2 border-white hover:bg-white/10 px-6 py-3 rounded-full font-medium transition-all"
          >
            {t('sign_in')}
          </Link>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-blue-800 hover:bg-blue-900 text-white py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
      >
        <FiArrowUp className="text-lg" />
        {t('back_to_top')}
      </button>
    </div>
  );
};

export default FooterCTA;