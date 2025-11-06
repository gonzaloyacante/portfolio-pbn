let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Permitir imágenes remotas (Cloudinary y variantes)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Añade aquí otros hosts si se usan (e.g., storage.googleapis.com)
    ],
  },
  // Desactivar flags experimentales para evitar inestabilidad en dev
  experimental: {},
  webpack: (config, { isServer }) => {
    // Ignorar warnings de Sentry/OpenTelemetry
    config.externals = config.externals || []
    config.externals.push({
      '@opentelemetry/instrumentation': '@opentelemetry/instrumentation',
      'require-in-the-middle': 'require-in-the-middle'
    })

    // Configurar para ignorar warnings específicos
    config.module.exprContextCritical = false

    return config
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon/favicon.ico',
        permanent: false,
      },
    ]
  },
  async headers() {
    const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      'https://www.googletagmanager.com',
      ...(isProd ? [] : ["'unsafe-eval'"]), // necesario para React Refresh en dev
    ].join(' ')

    const csp = [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' https: data: blob: https://res.cloudinary.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Conexiones a API local y a SSG/analytics externos si aplica
      ...(isProd
        ? [
            `connect-src 'self' ${apiUrl} https://*`,
          ]
        : [
            `connect-src 'self' ${apiUrl} http://localhost:4000 ws://localhost:3000 ws://127.0.0.1:3000 https://*`,
          ]),
      // Workers para dev (webpack, etc.)
      "worker-src 'self' blob:",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      // opcional: upgrade-insecure-requests en prod
      ...(isProd ? ["upgrade-insecure-requests"] : []),
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          // HSTS solo tiene efecto en HTTPS; en local no aplica
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
}

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

mergeConfig(nextConfig, userConfig)

export default nextConfig
