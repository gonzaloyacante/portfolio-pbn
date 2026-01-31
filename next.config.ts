import type { NextConfig } from 'next'

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

export default nextConfig
