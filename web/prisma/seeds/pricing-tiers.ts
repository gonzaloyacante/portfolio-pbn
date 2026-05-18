export interface SeedPricingTier {
  serviceSlug: string
  name: string
  price: string
  description: string
  sortOrder: number
}

export const pricingTiers: SeedPricingTier[] = [
  {
    serviceSlug: 'maquillaje-caracterizacion',
    name: 'Personaje único',
    price: '200',
    description: '1 personaje, diseño + aplicación de prótesis y maquillaje completo. 3-5h.',
    sortOrder: 0,
  },
  {
    serviceSlug: 'maquillaje-caracterizacion',
    name: 'Pack producción',
    price: '500',
    description: 'Hasta 5 personajes. Ideal para obras de teatro pequeñas o cortometrajes.',
    sortOrder: 1,
  },
  {
    serviceSlug: 'maquillaje-caracterizacion',
    name: 'Pack largometraje / obra',
    price: 'Consultar',
    description: 'Presupuesto personalizado para producciones de larga duración o elencos grandes.',
    sortOrder: 2,
  },
  {
    serviceSlug: 'efectos-especiales',
    name: 'Efecto simple',
    price: '150',
    description: '1 herida, quemadura o efecto básico. Materiales incluidos. 2-3h.',
    sortOrder: 0,
  },
  {
    serviceSlug: 'efectos-especiales',
    name: 'Efecto complejo',
    price: '300',
    description: 'Envejecimiento completo o FX corporal extenso con silicona y gelatina. 4-6h.',
    sortOrder: 1,
  },
  {
    serviceSlug: 'maquillaje-editorial',
    name: 'Sesión editorial',
    price: '250',
    description: '1 look para sesión fotográfica. Media jornada. Cambios adicionales: +50€/cambio.',
    sortOrder: 0,
  },
  {
    serviceSlug: 'maquillaje-editorial',
    name: 'Pack moda',
    price: '500',
    description: 'Jornada completa con hasta 4 looks diferentes para editorial de moda o catálogo.',
    sortOrder: 1,
  },
  {
    serviceSlug: 'posticeria-profesional',
    name: 'Bigote / barba (tul)',
    price: '80',
    description: 'Bigote o barba picada a mano en tul HD. Pelo natural o kanekalon.',
    sortOrder: 0,
  },
  {
    serviceSlug: 'posticeria-profesional',
    name: 'Peluca parcial',
    price: '150',
    description: 'Flequillo, toupée o media peluca picada a mano pelo a pelo.',
    sortOrder: 1,
  },
  {
    serviceSlug: 'posticeria-profesional',
    name: 'Peluca completa',
    price: 'Consultar',
    description: 'Peluca completa personalizada. Presupuesto según material y complejidad.',
    sortOrder: 2,
  },
]
