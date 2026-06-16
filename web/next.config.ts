import type { NextConfig } from 'next'
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

/** Origin for Reporting API absolute URLs (NEXT_PUBLIC_SITE_URL, VERCEL_URL, or localhost). */
function getReportingOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '')
  if (fromEnv) return fromEnv
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, '')
    return `https://${host}`
  }
  return 'http://localhost:3000'
}

const CSP_REPORT_GROUP = 'csp-endpoint'
const NEL_REPORT_GROUP = 'network-errors'
const isVercelBuild = process.env.VERCEL === '1' || process.env.VERCEL === 'true'

/**
 * Security Headers
 * CSP configured for: Cloudinary, Google Fonts, Sentry tunnel, Next.js
 */
function buildSecurityHeaders(): { key: string; value: string }[] {
  const reportAbsUrl = `${getReportingOrigin()}/api/csp-report`

  const reportingEndpointsHeader = `${CSP_REPORT_GROUP}="${reportAbsUrl}"`

  const reportToHeader = JSON.stringify([
    {
      group: CSP_REPORT_GROUP,
      max_age: 10_886_400,
      endpoints: [{ url: reportAbsUrl }],
    },
    {
      group: NEL_REPORT_GROUP,
      max_age: 2_592_000,
      endpoints: [{ url: reportAbsUrl }],
    },
  ])

  const nelHeader = JSON.stringify({
    report_to: NEL_REPORT_GROUP,
    max_age: 2_592_000,
    success_fraction: 0.05,
    failure_fraction: 1.0,
  })

  return [
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
      key: 'Reporting-Endpoints',
      value: reportingEndpointsHeader,
    },
    {
      key: 'Report-To',
      value: reportToHeader,
    },
    {
      key: 'NEL',
      value: nelHeader,
    },
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        // Scripts: Next.js (unsafe-inline para hydration), Sentry, Google Analytics, Vercel Live, reCAPTCHA, Instagram embed
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://browser.sentry-cdn.com https://js.sentry-cdn.com https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://*.vercel.live https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.instagram.com/",
        // Styles: inline (Next.js/Tailwind) + Google Fonts
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        // Images: Cloudinary, Unsplash, placehold.co, data URIs, blobs, GA pixel, Instagram
        "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://placehold.co https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://cdnjs.cloudflare.com https://*.cdninstagram.com https://www.instagram.com/ https://*.basemaps.cartocdn.com https://basemaps.cartocdn.com",
        // Fonts: self, data URIs, Google Fonts CDN
        "font-src 'self' data: https://fonts.gstatic.com https://*.basemaps.cartocdn.com",
        // Connect: API calls, Cloudinary uploads, Sentry, Google Fonts, Analytics, Vercel Live, IP Geolocation, reCAPTCHA, Instagram oEmbed, MyMemory translation
        "connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com https://sentry.io https://o4504953756499968.ingest.sentry.io https://fonts.googleapis.com https://fonts.gstatic.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://vercel.live wss://*.vercel.live https://get.geojs.io https://www.google.com/recaptcha/ https://www.gstatic.com/ https://www.instagram.com/ https://graph.instagram.com/ https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com https://api.mymemory.translated.net",
        // Media: Cloudinary (videos)
        "media-src 'self' https://res.cloudinary.com",
        // Objects: none (no Flash/plugins)
        "object-src 'none'",
        // Workers: Next.js inline workers
        "worker-src 'self' blob:",
        // Frames: Vercel Live (preview comments toolbar), reCAPTCHA, Instagram embed
        'frame-src https://vercel.live https://www.google.com/recaptcha/ https://recaptcha.google.com/ https://www.instagram.com/',
        // Base URI: only self
        "base-uri 'self'",
        // Form actions: only self (Server Actions)
        "form-action 'self'",
        // Frame ancestors: none (prevents clickjacking, redundant with X-Frame-Options)
        "frame-ancestors 'none'",
        // Reporting API (modern + legacy): group name matches Reporting-Endpoints / Report-To
        `report-to ${CSP_REPORT_GROUP}`,
        // Legacy reporting (still observed by older agents)
        'report-uri /api/csp-report',
      ].join('; '),
    },
  ]
}

const nextConfig: NextConfig = {
  // Extend client-side Router Cache so navigating back to visited pages
  // doesn't trigger a server re-fetch and show the loading skeleton.
  // 300s (5min) means: navigating back to a page visited within 5 minutes
  // uses the cached render instantly, with no loading flash.
  experimental: {
    staleTimes: {
      dynamic: 300, // 5 min for dynamic pages (default is 0)
      static: 3600, // 1 hour for static pages
    },
  },
  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: buildSecurityHeaders(),
      },
    ]
  },

  // Optimizaciones de imagen, seguridad, etc.
  images: {
    // Cloudinary ya hace transformaciones, formato y calidad por URL.
    // Evita que cualquier uso futuro de next/image pase por la cuota de Image Optimization de Vercel.
    unoptimized: true,
  },

  // Rewrites: Mapeo de URLs en Español -> Carpetas en Inglés
  async rewrites() {
    return [
      // ----------------------------
      // PÚBLICAS
      // ----------------------------
      { source: '/sobre-mi', destination: '/about' },
      { source: '/proyectos', destination: '/portfolio' },
      { source: '/proyectos/:slug*', destination: '/portfolio/:slug*' },

      { source: '/contacto', destination: '/contact' },
      { source: '/servicios', destination: '/services' },
      { source: '/servicios/:slug', destination: '/services/:slug' },
      { source: '/privacidad', destination: '/privacy' },
      { source: '/testimonio', destination: '/testimony' },

      // ----------------------------
      // ADMIN
      // ----------------------------
      // Dashboard & Core
      { source: '/admin/panel', destination: '/admin/dashboard' },
      { source: '/admin/inicio', destination: '/admin/home' },

      // Portfolio / Categorías (old proyectos redirects)
      { source: '/admin/proyectos', destination: '/admin/categories' },
      { source: '/admin/proyectos/nuevo', destination: '/admin/categories/new' },
      { source: '/admin/proyectos/:id/editar', destination: '/admin/categories/:id/edit' },

      // Categorías
      { source: '/admin/categorias', destination: '/admin/categories' },
      { source: '/admin/categorias/nueva', destination: '/admin/categories/new' },
      { source: '/admin/categorias/:id/editar', destination: '/admin/categories/:id/edit' },
      { source: '/admin/categorias/:id/galeria', destination: '/admin/categories/:id/gallery' },

      // Testimonios
      { source: '/admin/testimonios', destination: '/admin/testimonials' },
      { source: '/admin/testimonios/:id/editar', destination: '/admin/testimonials/:id/edit' },

      // Contactos (Mensajes)
      { source: '/admin/contactos', destination: '/admin/contacts' },
      { source: '/admin/contactos/configuracion', destination: '/admin/settings' },

      // Sobre Mí
      { source: '/admin/sobre-mi', destination: '/admin/about' },

      // Configuración General (Settings)
      { source: '/admin/configuracion', destination: '/admin/settings' },
      { source: '/admin/configuracion/sitio', destination: '/admin/settings/site' },

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

// Wrap with Sentry
export default withSentryConfig(withBundleAnalyzer(nextConfig), {
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

  // Local builds must not depend on Sentry network upload. Vercel builds still upload.
  sourcemaps: {
    disable: !isVercelBuild,
  },

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
