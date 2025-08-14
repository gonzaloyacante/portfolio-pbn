/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/djlknirsd/**",
      },
    ],
    // Formatos modernos que mejoran significativamente la optimización
    formats: ['image/webp', 'image/avif'],
    // Calidad de imagen optimizada (80% suele ser un buen equilibrio)
    quality: 80,
    // Habilitar placeholder difuminado para mejorar la percepción de carga
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Optimización para recursos estáticos
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  // Optimización de chunks para reducir tiempo de carga
  webpack: (config, { isServer }) => {
    // Configuramos un tamaño mínimo para chunks y ajustamos otros parámetros de optimización
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 90000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 25,
      automaticNameDelimiter: '.',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
};

// Añadimos configuraciones específicas por entorno
if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
  console.log('Configuración para entorno de DESARROLLO cargada');
  // Añadir configuraciones específicas para desarrollo si son necesarias
}

if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
  console.log('Configuración para entorno de PRODUCCIÓN cargada');
  // Configuraciones específicas para producción si son necesarias
}
