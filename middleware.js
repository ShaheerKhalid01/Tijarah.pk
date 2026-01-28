// middleware.js
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
export default createMiddleware({
  locales: ['en', 'ar', 'ur', 'zh', 'tr', 'ms', 'id'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};