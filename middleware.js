// middleware.js
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Performance optimization: Pre-compile regex patterns
const STATIC_FILE_PATTERN = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i;
const API_ROUTE_PATTERN = /^\/api\//i;
const IMAGE_OPTIMIZATION_PATTERN = /\/_next\/image/;

// Performance optimization: Cache locale detection
const defaultLocale = 'en';
const locales = ['en', 'ur', 'zh', 'tr', 'ms', 'id'];

// Performance optimization: Use Set for O(1) lookups
const publicPaths = new Set([
  'id',
  'admin-auth/login',
  '_next',
  'favicon.ico',
  'api/auth',
  'images',
  'fonts',
  'api/check-auth',
  'api/test-auth',
  'login',
  'register',
  'categories',
  'cart',
  'customer-service',
  'deals',
  'new-arrivals',
  'special-offers',
  'sell',
  'search',
  'product',
  'products'
]);

// Performance optimization: Pre-compile admin paths
const adminPathPrefixes = ['admin'];

// Performance optimization: Cached responses for static assets
const staticAssetCache = new Map();

// Performance optimization: Cache token verification
const tokenCache = new Map();
const TOKEN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Performance optimization: Check if path is public
const isPublicPath = (path) => {
  if (!path) return false;

  // Remove leading slash and split into segments
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const segments = cleanPath.split('/');

  // Check if the first segment is a locale
  const firstSegment = segments[0];
  const isLocale = locales.includes(firstSegment);

  // Get the path without locale
  const pathWithoutLocale = isLocale ? segments.slice(1).join('/') : cleanPath;

  // Check against public paths
  // We check if the path starts with any of the public paths (for nested routes like /product/123)
  // or if it matches exactly
  if (pathWithoutLocale === '') return true; // Root path (after locale strip) is public

  for (const publicPath of publicPaths) {
    if (publicPath === pathWithoutLocale || pathWithoutLocale.startsWith(`${publicPath}/`)) {
      return true;
    }
  }

  return IMAGE_OPTIMIZATION_PATTERN.test(path);
};

// Performance optimization: Check if path is admin
const isAdminPath = (path) => {
  if (!path) return false;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return adminPathPrefixes.some(prefix => cleanPath.startsWith(prefix));
};

export default async function middleware(request) {
  try {
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

    // Get the token for protected routes
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      // Ensure secure cookie is used on HTTPS or production
      secureCookie: request.nextUrl.protocol === 'https:' || process.env.NODE_ENV === 'production',
    });

    // Debug logs
    console.log('Middleware debug:', {
      pathname,
      hasToken: !!token,
      tokenRole: token?.role,
      pathLocale
    });

    // Check if this is an admin route (excluding admin-auth)
    if (pathname.includes('/admin') && !pathname.includes('/admin-auth')) {
      console.log('Admin route detected:', pathname);

      // If no token or not admin role, redirect to admin login
      if (!token || token.role !== 'admin') {
        console.log('Redirecting to admin login - not authenticated or not admin');
        const loginUrl = new URL(`/${pathLocale}/admin-auth/login`, request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      console.log('Admin authenticated, allowing access');
      return NextResponse.next();
    }

    // Skip auth check for public paths
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }

    // For other protected routes, redirect to regular login if not authenticated
    if (!token) {
      const loginUrl = new URL(`/${pathLocale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Continue with the request if authenticated
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    // In case of error, redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    // - static files (e.g., .png, .jpg, etc.)
    '/((?!api/|_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|json)$).*)'
  ],
};