/**
 * Validaciones con Zod para seguridad y consistencia.
 *
 * Organizadas por dominio (ARQ4): formularios públicos, settings de admin,
 * theme editor, contenido (categorías/servicios/testimonios), bookings,
 * auth y schemas varios de API. Este barrel mantiene un único punto de
 * import (`@/lib/validations`) para no tener que tocar los ~45 archivos
 * que ya dependen de él.
 */

export * from './shared'
export * from './forms'
export * from './theme'
export * from './settings'
export * from './content'
export * from './bookings'
export * from './auth'
export * from './api-misc'
