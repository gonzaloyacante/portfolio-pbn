/**
 * Helpers comunes para los modelos "singleton" de configuración
 * (HomeSettings, ThemeSettings, ContactSettings, etc.), todos con
 * `key String @unique @default("singleton")`.
 *
 * M18: antes cada acción hacía `findFirst()` (con criterios distintos:
 * `{isActive:true}`, sin filtro, `{key:'singleton'}`) y luego `create()`
 * o `update()` por separado. Si dos requests veían "no existe fila" al
 * mismo tiempo, ambos `create()` competían por la misma `key` única →
 * P2002 (unique constraint) → 500. `upsertSingleton` hace todo en una
 * sola operación atómica de Prisma (`INSERT ... ON CONFLICT DO UPDATE`),
 * eliminando esa carrera. `findSingleton` unifica la lectura sobre el
 * único índice realmente garantizado por la DB: `key`.
 */

import { Prisma } from '@/generated/prisma/client'
import { DEFAULT_SERVICES_PAGE_LIST_INTRO } from '@/lib/services-page-settings'

export const SINGLETON_WHERE = { key: 'singleton' } as const

/**
 * Valores para la fila inicial de cada settings singleton (cuando todavía no
 * existe ninguna). Se usan tanto desde las server actions (web) como desde
 * `/api/admin/settings/[type]` (mobile), para que ambos paths creen la fila
 * con los mismos valores por defecto.
 */
export const HOME_SETTINGS_DEFAULTS: Prisma.HomeSettingsCreateInput = {
  heroForegroundPortraitShow: false,
  showFeaturedImages: false,
  featuredCount: 3,
}

export const CONTACT_SETTINGS_DEFAULTS: Prisma.ContactSettingsCreateInput = {
  email: '',
}

export const SERVICES_PAGE_SETTINGS_DEFAULTS: Prisma.ServicesPageSettingsCreateInput = {
  listIntro: DEFAULT_SERVICES_PAGE_LIST_INTRO,
}

interface SingletonDelegate<
  TRow = Record<string, unknown>,
  TCreate = Record<string, unknown>,
  TUpdate = Record<string, unknown>,
> {
  findUnique(args: { where: { key: string } }): Promise<TRow | null>
  upsert(args: { where: { key: string }; create: TCreate; update: TUpdate }): Promise<TRow>
}

/** Lee la fila singleton de un modelo de settings, o `null` si nunca se creó. */
export function findSingleton<TRow, TCreate, TUpdate>(
  delegate: SingletonDelegate<TRow, TCreate, TUpdate>
): Promise<TRow | null> {
  return delegate.findUnique({ where: SINGLETON_WHERE })
}

/**
 * Crea o actualiza la fila singleton de forma atómica.
 * `defaults` se usa solo si la fila no existe todavía (se combina con `data`
 * para formar el `create`); si ya existe, se aplica `data` como `update`.
 */
export function upsertSingleton<TRow, TCreate, TUpdate>(
  delegate: SingletonDelegate<TRow, TCreate, TUpdate>,
  defaults: TCreate,
  data: TUpdate
): Promise<TRow> {
  return delegate.upsert({
    where: SINGLETON_WHERE,
    create: { ...defaults, ...data } as TCreate,
    update: data,
  })
}
