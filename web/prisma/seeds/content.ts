// ============================================
// REAL CONTENT DATA - Paola Bolívar Nievas
// ============================================

export const categories = [
  {
    id: '78nOaQ4yroN1HfEOxYkT',
    name: 'Maquillaje',
    slug: 'maquillaje',
    description:
      'Maquillaje profesional para eventos, sesiones fotográficas y producciones audiovisuales',
    sortOrder: 1,
  },
  {
    id: 'VKPLTpOJQWNpOpCN3U1P',
    name: 'FX',
    slug: 'fx',
    description: 'Efectos especiales, caracterización y prótesis para cine, teatro y eventos',
    sortOrder: 2,
  },
  {
    id: 'oEEXvBJHvUj0VaGCcILS',
    name: 'Teatro',
    slug: 'teatro',
    description: 'Maquillaje y caracterización para obras teatrales y espectáculos en vivo',
    sortOrder: 3,
  },
  {
    id: 'y8Ydk2thZhU3mkNBk9ru',
    name: 'Posticería',
    slug: 'posticeria',
    description: 'Pelucas, bigotes, barbas y postizos capilares hechos a mano',
    sortOrder: 4,
  },
]

export const services = [
  {
    name: 'Maquillaje de Caracterización',
    slug: 'maquillaje-caracterizacion',
    description:
      'Creación de personajes únicos para cine, teatro y producciones audiovisuales. Incluye diseño, aplicación de prótesis y maquillaje de caracterización completo.',
    price: 200,
    priceLabel: 'desde',
    duration: '3-5 horas',
    iconName: 'Wand2',
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: 'Efectos Especiales (FX)',
    slug: 'efectos-especiales',
    description:
      'Heridas, quemaduras, envejecimiento, zombies y todo tipo de efectos especiales. Materiales profesionales de alta calidad: látex, silicona, gelatina balística.',
    price: 150,
    priceLabel: 'desde',
    duration: '2-4 horas',
    iconName: 'Sparkles',
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: 'Maquillaje para Sesiones Fotográficas',
    slug: 'maquillaje-editorial',
    description:
      'Maquillaje creativo y de tendencia para sesiones fotográficas de moda, publicidad o portfolios. Adaptable al concepto artístico del proyecto.',
    priceLabel: 'consultar',
    duration: 'Media jornada o jornada completa',
    iconName: 'Camera',
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
  },
  {
    name: 'Posticería Profesional',
    slug: 'posticeria-profesional',
    description:
      'Bigotes, barbas, flequillos y pelucas picadas a mano pelo a pelo en tul HD. Uso de pelo natural o kanekalon según necesidad.',
    price: 80,
    priceLabel: 'desde',
    duration: 'Variable según proyecto',
    iconName: 'Star',
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
  },
]

export const testimonials = [
  {
    id: 'testimonial-1',
    name: 'María García',
    text: 'Trabajé con Paola en una producción teatral y su profesionalismo es excepcional. Los maquillajes duraron impecables toda la temporada y cada personaje tenía su propia identidad gracias a su trabajo.',
    position: 'Directora de Arte',
    company: 'Teatro Alhambra',
    rating: 5,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'testimonial-2',
    name: 'Carlos Ruiz',
    text: 'Contraté a Paola para efectos especiales en mi cortometraje y el resultado superó todas las expectativas. Su creatividad y atención al detalle son impresionantes.',
    position: 'Director',
    company: 'Edificio 23 Films',
    rating: 5,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'testimonial-3',
    name: 'Laura Martínez',
    text: 'He trabajado con Paola en múltiples sesiones fotográficas y siempre aporta ideas geniales. Su técnica es impecable y sabe exactamente cómo adaptarse a diferentes estilos.',
    position: 'Fotógrafa',
    company: 'LM Photography',
    rating: 5,
    isActive: true,
    sortOrder: 3,
  },
]

export const socialLinks = [
  {
    platform: 'instagram',
    url: 'https://instagram.com/paolabolivarnievas',
    username: '@paolabolivarnievas',
    icon: 'Instagram',
    sortOrder: 1,
  },
  {
    platform: 'tiktok',
    url: 'https://tiktok.com/@paolabolivarnievas',
    username: '@paolabolivarnievas',
    icon: 'Music2',
    sortOrder: 2,
  },
  {
    platform: 'youtube',
    url: 'https://youtube.com/@paolabolivarnievas',
    username: '@paolabolivarnievas',
    icon: 'Youtube',
    sortOrder: 3,
  },
  {
    platform: 'linkedin',
    url: 'https://linkedin.com/in/paolabolivarnievas',
    username: 'Paola Bolívar',
    icon: 'Linkedin',
    sortOrder: 4,
  },
]
