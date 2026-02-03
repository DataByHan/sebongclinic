import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function buildCsp(): string {
  // Note: Next.js and some third-party scripts may rely on inline scripts/styles.
  // This CSP is a pragmatic baseline for this site; tighten further if you can adopt nonces.
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' https://dapi.kakao.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://dapi.kakao.com",
    'upgrade-insecure-requests',
  ].join('; ')
}

export function middleware(request: NextRequest) {
  const res = NextResponse.next()

  res.headers.set('Content-Security-Policy', buildCsp())
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/admin-') || pathname.startsWith('/api/')) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  }

  // Avoid caching the admin page itself.
  if (pathname.startsWith('/admin-')) {
    res.headers.set('Cache-Control', 'no-store')
  }

  return res
}

export const config = {
  matcher: [
    // Apply to pages and API routes; exclude static assets.
    '/((?!_next/static|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
