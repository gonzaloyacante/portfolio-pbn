export const projects = [
  // --- CARACTERIZACIÓN ---
  {
    title: 'Zombie Apocalypse FX',
    slug: 'zombie-apocalypse-fx',
    description: `Proyecto de caracterización completa para cortometraje de terror independiente. 
    
El objetivo era crear tres etapas diferentes de infección zombie:
1. Etapa inicial: Piel pálida, venas marcadas y ojos inyectados.
2. Etapa media: Heridas abiertas, necrosis parcial y pérdida de cabello.
3. Etapa avanzada: Deformación facial severa, exposición ósea y descomposición total.

Se utilizaron prótesis de silicona encapsulada, prótesis dentales a medida y lentes de contacto esclerales. El rodaje duró 3 días consecutivos con sesiones de maquillaje de 4 horas por actor.`,
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/reindeer.jpg', // Placeholder
    date: new Date('2023-10-31'),
    categorySlug: 'fx',
    isFeatured: true,
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/reindeer.jpg',
        alt: 'Zombie Etapa Media',
        order: 1,
      },
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/nature.jpg',
        alt: 'Detalle de heridas',
        order: 2,
      },
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/boy-snow-hoodie.jpg',
        alt: 'Proceso de aplicación',
        order: 3,
      },
    ],
  },
  {
    title: 'Elfa del Bosque',
    slug: 'elfa-bosque-fantasia',
    description: `Caracterización de fantasía para sesión editorial "Mitos y Leyendas".
    
Se aplicaron prótesis de orejas de látex, se trabajó la piel con aerógrafo para lograr un tono etéreo y se añadieron elementos orgánicos (hojas, ramas pequeñas) integrados en el maquillaje y peinado.

Técnicas utilizadas:
- Aplicación de prótesis
- Maquillaje con aerógrafo
- Posticería facial (cejas)
- Integración de elementos 3D`,
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/cat.jpg', // Placeholder
    date: new Date('2023-05-15'),
    categorySlug: 'maquillaje-fantasia',
    isFeatured: false,
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/cat.jpg',
        alt: 'Retrato Elfa',
        order: 1,
      },
    ],
  },

  // --- NOVIAS ---
  {
    title: 'Boda Civil en la Playa',
    slug: 'boda-civil-playa',
    description: `Maquillaje para novia en boda de día en la playa.
    
Buscábamos un look "glowy" y muy natural que resistiera la humedad y el calor. Se preparó la piel con hidratación profunda y se utilizaron productos waterproof de larga duración.

Tonos utilizados: Melocotón, dorado suave y bronce.
Foco: Piel luminosa y pestañas definidas.`,
    thumbnailUrl:
      'https://res.cloudinary.com/demo/image/upload/v1/samples/woman-on-a-football-field.jpg', // Placeholder
    date: new Date('2024-06-20'),
    categorySlug: 'novias',
    isFeatured: true,
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/woman-on-a-football-field.jpg',
        alt: 'Novia sonriendo',
        order: 1,
      },
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/kitchen-bar.jpg',
        alt: 'Detalle ojos',
        order: 2,
      },
    ],
  },

  // --- AUDIOVISUAL ---
  {
    title: 'Cortometraje "El Último Suspiro"',
    slug: 'corto-ultimo-suspiro',
    description: `Jefa de maquillaje para cortometraje dramático ambientado en los años 40.
    
El reto principal fue recrear la estética de la época con fidelidad histórica, adaptándola a la iluminación cinematográfica moderna. Se realizó un estudio previo de peinados y maquillaje de la década.

También se realizaron efectos de envejecimiento sutil para los flashbacks del protagonista.`,
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/jazz.jpg', // Placeholder
    date: new Date('2023-11-15'),
    categorySlug: 'rodajes',
    isFeatured: true,
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/jazz.jpg',
        alt: 'Escena principal',
        order: 1,
      },
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/architecture.jpg',
        alt: 'Retoque en set',
        order: 2,
      },
    ],
  },
  {
    title: 'Videoclip "Neon Nights"',
    slug: 'videoclip-neon-nights',
    description: `Maquillaje artístico para videoclip musical de estilo Synthwave.
    
Uso intensivo de pigmentos neón reactivos a la luz UV, purpurina y delineados gráficos geométricos. El maquillaje debía destacar bajo luces negras y estroboscópicas.`,
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/bicycle.jpg', // Placeholder
    date: new Date('2024-01-10'),
    categorySlug: 'rodajes',
    isFeatured: false,
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/bicycle.jpg',
        alt: 'Cantante principal',
        order: 1,
      },
    ],
  },
]
