"use client";

import Link from 'next/link';
import { FiArrowUp, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo, memo } from 'react';

// ✅ OPTIMIZED: Memoized back to top button
const BackToTopButton = memo(({ label }) => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className="w-full bg-blue-800 hover:bg-blue-900 text-white py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors active:bg-blue-950"
      aria-label={label}
      type="button"
    >
      <FiArrowUp className="text-lg" />
      {label}
    </button>
  );
});

BackToTopButton.displayName = 'BackToTopButton';

// ✅ OPTIMIZED: Authenticated user section with proper hydration
const AuthenticatedSection = memo(({ session, locale, t }) => {
  const userName = useMemo(() => 
    session?.user?.name || 'User',
    [session?.user?.name]
  );

  return (
    <div className="w-full font-sans bg-gradient-to-r from-green-600 to-green-800" suppressHydrationWarning>
      <div className="py-10 px-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-4" suppressHydrationWarning>
          Welcome back, {userName}!
        </h3>
        <p className="text-green-100 mb-6 max-w-2xl mx-auto" suppressHydrationWarning>
          {t('continue_shopping_prompt')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href={`/${locale}/returns-orders`} 
            className="bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
          >
            <FiShoppingCart className="text-lg" aria-hidden="true" />
            {t('my_orders')}
          </Link>
          <Link 
            href={`/${locale}/categories/electronics`} 
            className="text-white border-2 border-white hover:bg-white/10 px-6 py-3 rounded-full font-medium transition-all active:scale-95 flex items-center gap-2"
          >
            <FiHeart className="text-lg" aria-hidden="true" />
            {t('continue_shopping')}
          </Link>
        </div>
      </div>

      <BackToTopButton label={t('back_to_top')} />
    </div>
  );
});

AuthenticatedSection.displayName = 'AuthenticatedSection';

// ✅ OPTIMIZED: Unauthenticated user section with proper hydration
const UnauthenticatedSection = memo(({ locale, t }) => {
  return (
    <div className="w-full font-sans bg-gradient-to-r from-blue-600 to-blue-800" suppressHydrationWarning>
      <div className="py-10 px-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-4" suppressHydrationWarning>
          {t('title')}
        </h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto" suppressHydrationWarning>
          {t('description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href={`/${locale}/register`} 
            className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            {t('get_started')}
          </Link>
          <Link 
            href={`/${locale}/login`} 
            className="text-white border-2 border-white hover:bg-white/10 px-6 py-3 rounded-full font-medium transition-all active:scale-95"
          >
            {t('sign_in')}
          </Link>
        </div>
      </div>

      <BackToTopButton label={t('back_to_top')} />
    </div>
  );
});

UnauthenticatedSection.displayName = 'UnauthenticatedSection';

// ✅ OPTIMIZED: Main component
const FooterCTA = memo(() => {
  const pathname = usePathname();
  const t = useTranslations('footer_cta');
  const { data: session, status } = useSession();

  // ✅ Memoize locale extraction
  const locale = useMemo(() => 
    pathname?.split('/')[1] || 'en',
    [pathname]
  );

  // ✅ Always show content to avoid hydration mismatch
  // Server renders as unauthenticated, client hydrates with actual status
  return status === 'authenticated' && session ? (
    <AuthenticatedSection session={session} locale={locale} t={t} />
  ) : (
    <UnauthenticatedSection locale={locale} t={t} />
  );
});

FooterCTA.displayName = 'FooterCTA';

export default FooterCTA;