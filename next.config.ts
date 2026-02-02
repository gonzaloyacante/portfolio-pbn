import type { NextConfig } from 'next'
import withPWA from '@ducanh2912/next-pwa'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
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

      // Ayuda
      { source: '/admin/ayuda', destination: '/admin/help' },

      // Papelera
      { source: '/admin/papelera', destination: '/admin/trash' },
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
})(nextConfig)

// Wrap with Sentry
export default withSentryConfig(pwaConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'gonzaloyacante',
  project: 'portfolio-pbn',

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
    reactComponentAnnotation: {
      enabled: true,
    },
  },
})
