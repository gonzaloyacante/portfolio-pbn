import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Proteger solo rutas /admin excepto las públicas de auth
  const isAdminRoute = pathname.startsWith('/admin')
  const isAuthPublic = pathname.startsWith('/admin/auth')

  if (isAdminRoute && !isAuthPublic) {
    const session = req.cookies.get('session')?.value
    if (!session) {
      const loginUrl = new URL('/admin/auth/login', req.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
