export const categories = [
  {
    name: 'Sesiones de fotos',
    slug: 'sesiones-de-fotos',
    description: 'Maquillaje para sesiones fotográficas profesionales, editoriales y moda.',
    sortOrder: 1,
  },
  {
    name: 'FX',
    slug: 'fx',
    description: 'Efectos especiales, prótesis y maquillaje de caracterización avanzada.',
    sortOrder: 2,
  },
  {
    name: 'Teatro',
    slug: 'teatro',
    description: 'Maquillaje para producciones teatrales y espectáculos en vivo.',
    sortOrder: 3,
  },
  {
    name: 'Maquillaje fantasía',
    slug: 'maquillaje-fantasia',
    description: 'Looks creativos y artísticos de fantasía, bodypainting y facepainting.',
    sortOrder: 4,
  },
  {
    name: 'Novias',
    slug: 'novias',
    description: 'Maquillaje especializado para novias, con pruebas y tratamiento de piel.',
    sortOrder: 5,
  },
  {
    name: 'Rodajes',
    slug: 'rodajes',
    description: 'Maquillaje para producciones de cine, cortometrajes y televisión.',
    sortOrder: 5,
  },
  {
    name: 'Maquillaje social',
    slug: 'maquillaje-social',
    description: 'Maquillaje para eventos sociales, bodas, graduaciones y celebraciones.',
    sortOrder: 6,
  },
]

export const services = [
  {
    name: 'Maquillaje de Novias',
    slug: 'maquillaje-novias',
    description:
      'Servicio exclusivo para novias. Incluye prueba de maquillaje, preparación de la piel y kit de retoque. Diseño personalizado para resaltar tu belleza natural en tu día especial.',
    price: 150,
    priceLabel: 'desde',
    duration: '2-3 horas',
    iconName: 'Sparkles',
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: 'Caracterización y FX',
    slug: 'caracterizacion-fx',
    description:
      'Creación de personajes, heridas, envejecimiento y prótesis para cine, teatro o eventos temáticos. Utilizamos materiales profesionales de alta calidad.',
    price: 200,
    priceLabel: 'desde',
    duration: '3-4 horas',
    iconName: 'Wand2',
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: 'Maquillaje Editorial',
    slug: 'maquillaje-editorial',
    description:
      'Maquillaje creativo y de tendencia para sesiones fotográficas de moda, publicidad o portfolios de modelos. Adaptable al concepto artístico.',
    priceLabel: 'consultar',
    duration: 'Jornada completa o media',
    iconName: 'Camera',
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
  },
  {
    name: 'Maquillaje Social',
    slug: 'social-invitada',
    description:
      'Maquillaje perfecto para invitadas de boda, graduaciones o fiestas. Acabado duradero y a prueba de cámara.',
    price: 60,
    priceLabel: 'precio fijo',
    duration: '1 hora',
    iconName: 'Star',
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
  },
]

export const testimonials = [
  {
    id: 'test1',
    name: 'María García',
    text: 'Paola hizo mi maquillaje de novia y quedé absolutamente encantada. Supo captar exactamente lo que quería y el resultado fue espectacular. El maquillaje duró toda la noche intacto. ¡Totalmente profesional y atenta a cada detalle!',
    position: 'Novia',
    rating: 5,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'test2',
    name: 'Carlos Ruiz',
    text: 'Trabajamos juntos en una producción de cortometraje y su trabajo de caracterización fue impresionante. Muy ágil trabajando en set y con una creatividad desbordante para solucionar imprevistos. Sin duda volveré a contar con ella.',
    position: 'Director de Cine',
    company: 'Cortometraje "Sombras"',
    rating: 5,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'test3',
    name: 'Laura Martínez',
    text: 'Contraté a Paola para una sesión de fotos editoriales y los resultados superaron todas mis expectativas. Entendió el moodboard a la perfección y aportó ideas geniales. Su técnica es impecable.',
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
