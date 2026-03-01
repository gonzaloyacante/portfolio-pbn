import type { NextConfig } from 'next'
import withPWA from '@ducanh2912/next-pwa'
import { withSentryConfig } from '@sentry/nextjs'

// @next/bundle-analyzer is a devDependency — not available in production Vercel builds.
// We guard the import with try/catch so the build doesn't fail when devDeps are skipped.
type ConfigWrapper = (cfg: NextConfig) => NextConfig
let withBundleAnalyzer: ConfigWrapper = (cfg) => cfg
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bundleAnalyzer = require('@next/bundle-analyzer') as (opts: {
    enabled: boolean
    openAnalyzer: boolean
  }) => ConfigWrapper
  withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: true,
  })
} catch {
  // noop: in production, @next/bundle-analyzer is not installed (devDependency only)
}

/**
 * Security Headers
 * CSP configured for: Cloudinary, Google Fonts, Sentry tunnel, Next.js
 */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: Next.js (unsafe-inline para hydration), Sentry, Google Analytics, Vercel Live
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://browser.sentry-cdn.com https://js.sentry-cdn.com https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://*.vercel.live",
      // Styles: inline (Next.js/Tailwind) + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: Cloudinary, Unsplash, placehold.co, data URIs, blobs, GA pixel
      "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://placehold.co https://www.googletagmanager.com https://www.google-analytics.com",
      // Fonts: self, data URIs, Google Fonts CDN
      "font-src 'self' data: https://fonts.gstatic.com",
      // Connect: API calls, Cloudinary uploads, Sentry, Google Fonts, Analytics, Vercel Live, IP Geolocation
      "connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com https://sentry.io https://o4504953756499968.ingest.sentry.io https://fonts.googleapis.com https://fonts.gstatic.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://vercel.live wss://*.vercel.live https://get.geojs.io",
      // Media: Cloudinary (videos)
      "media-src 'self' https://res.cloudinary.com",
      // Objects: none (no Flash/plugins)
      "object-src 'none'",
      // Workers: Next.js + PWA service worker
      "worker-src 'self' blob:",
      // Frames: Vercel Live (preview comments toolbar)
      'frame-src https://vercel.live',
      // Base URI: only self
      "base-uri 'self'",
      // Form actions: only self (Server Actions)
      "form-action 'self'",
      // Frame ancestors: none (prevents clickjacking, redundant with X-Frame-Options)
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  // Optimizaciones de imagen, seguridad, etc.
  images: {
    formats: ['image/webp', 'image/avif'],
    // Dominios permitidos para imágenes externas (si aplica)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },

  // Rewrites: Mapeo de URLs en Español -> Carpetas en Inglés
  async rewrites() {
    return [
      // ----------------------------
      // PÚBLICAS
      // ----------------------------
      { source: '/sobre-mi', destination: '/about' },
      { source: '/proyectos', destination: '/projects' },
      { source: '/proyectos/:slug*', destination: '/projects/:slug*' }, // Si usas slugs
      // Si tienes ruta singular para detalle:
      { source: '/proyecto/:slug', destination: '/project/:slug' },

      { source: '/contacto', destination: '/contact' },
      { source: '/servicios', destination: '/services' },
      { source: '/servicios/:slug', destination: '/services/:slug' },
      { source: '/privacidad', destination: '/privacy' },

      // ----------------------------
      // ADMIN
      // ----------------------------
      // Dashboard & Core
      { source: '/admin/panel', destination: '/admin/dashboard' },
      { source: '/admin/inicio', destination: '/admin/home' },

      // Proyectos
      { source: '/admin/proyectos', destination: '/admin/projects' },
      { source: '/admin/proyectos/nuevo', destination: '/admin/projects/new' },
      { source: '/admin/proyectos/:id/editar', destination: '/admin/projects/:id/edit' },
      // { source: '/admin/proyectos/configuracion', destination: '/admin/projects/settings' }, // REMOVED (Merged into /projects)

      // Categorías
      { source: '/admin/categorias', destination: '/admin/categories' },
      { source: '/admin/categorias/nueva', destination: '/admin/categories/new' },
      { source: '/admin/categorias/:id/editar', destination: '/admin/categories/:id/edit' },

      // Testimonios
      { source: '/admin/testimonios', destination: '/admin/testimonials' },
      // (Si tuvieras /new o /edit, agregarlos aquí)

      // Contactos (Mensajes)
      { source: '/admin/contactos', destination: '/admin/contacts' },

      // Sobre Mí
      { source: '/admin/sobre-mi', destination: '/admin/about' },

      // Configuración General (Settings)
      { source: '/admin/configuracion', destination: '/admin/settings' },

      // Tema
      { source: '/admin/tema', destination: '/admin/theme' },

      // Analítica
      { source: '/admin/analitica', destination: '/admin/analytics' },

      // Perfil / Mi Cuenta
      { source: '/admin/mi-cuenta', destination: '/admin/account' },
      { source: '/admin/perfil', destination: '/admin/profile' }, // Si usas profile.tsx

      // Servicios
      { source: '/admin/servicios', destination: '/admin/services' },
      { source: '/admin/servicios/nuevo', destination: '/admin/services/new' },

      // Ayuda
      { source: '/admin/ayuda', destination: '/admin/help' },

      // Papelera
      { source: '/admin/papelera', destination: '/admin/trash' },

      // Calendario (reservas)
      { source: '/admin/calendario', destination: '/admin/calendar' },
    ]
  },
}

// Wrap with PWA plugin
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'cloudinary-images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-stylesheets',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-images',
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          },
        },
      },
    ],
  },
})(withBundleAnalyzer(nextConfig))

// Wrap with Sentry
export default withSentryConfig(pwaConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'gonzaloyacante',
  project: 'portfolio-pbn-web',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Webpack-specific options (v10+ API)
  webpack: {
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },

    // Enables automatic instrumentation of Vercel Cron Monitors
    // See: https://docs.sentry.io/product/crons/
    automaticVercelMonitors: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    // DISABLED: causes `useContext(null)` TypeError during static pre-rendering in Next.js 16 + React 19
    // See: https://github.com/getsentry/sentry-javascript/issues/XXXX
    reactComponentAnnotation: {
      enabled: false,
    },
  },
})
