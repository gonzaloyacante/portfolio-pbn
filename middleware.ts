import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

/**
 * Middleware con autenticación y headers de seguridad
 */

// Wrapper para agregar security headers
// Combinar auth middleware con security headers
export default withAuth(
  function middleware() {
    // La lógica de headers de seguridad se maneja en next.config.ts
    // Aquí podemos agregar lógica específica de middleware si es necesario
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rutas admin requieren rol ADMIN
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
