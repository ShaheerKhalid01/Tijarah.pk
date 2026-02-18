// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const defaultLocale = 'en';
const locales = ['en', 'ur', 'zh', 'tr', 'ms', 'id'];

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Handle root path redirection
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  // Check if the path starts with a valid locale
  const pathLocale = pathname.split('/')[1];
  const hasValidLocale = locales.includes(pathLocale);

  // If the path doesn't start with a valid locale, redirect to default locale
  if (!hasValidLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Only protect admin routes — everything else is public
  // Auth for user-only pages (like checkout) is handled client-side via useSession
  const isAdminRoute = pathname.includes('/admin') && !pathname.includes('/admin-auth');

  if (isAdminRoute) {
    try {
      const isSecure = request.nextUrl.protocol === 'https:' || process.env.NODE_ENV === 'production';
      const cookieName = isSecure
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token';

      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName,
      });

      if (!token || token.role !== 'admin') {
        const loginUrl = new URL(`/${pathLocale}/admin-auth/login`, request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Admin auth error:', error);
      const loginUrl = new URL(`/${pathLocale}/admin-auth/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|json)$).*)'
  ],
};