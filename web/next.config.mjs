/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript configuration
  typescript: {
    // ⚠️ CRITICAL: Remove ignoreBuildErrors in production!
    // This should be false to catch type errors during build
    ignoreBuildErrors: false,
  },

  // Image optimization
  images: {
    unoptimized: false, // Enable optimization for production
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // React strict mode
  reactStrictMode: true,

  // Power-by header
  poweredByHeader: false,

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://hebbkx1anhila5yf.public.blob.vercel-storage.com https://res.cloudinary.com",
              "connect-src 'self' http://localhost:5000 https://res.cloudinary.com https://va.vercel-scripts.com",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Redirect /admin to /admin/login if not authenticated
      // (This is handled by middleware, but kept here for clarity)
    ];
  },

  // Output configuration
  output: 'standalone', // For Docker/containerized deployments
};

export default nextConfig;
