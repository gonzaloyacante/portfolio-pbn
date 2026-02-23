import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

// ── Mapa de tipo → modelo Prisma ──────────────────────────────────────────────
const SETTINGS_MAP = {
  home: 'homeSettings',
  about: 'aboutSettings',
  contact: 'contactSettings',
  theme: 'themeSettings',
  site: 'siteSettings',
  project: 'projectSettings',
  testimonial: 'testimonialSettings',
} as const

type SettingsType = keyof typeof SETTINGS_MAP

// Campos que nunca se actualizan desde la app
const FORBIDDEN_FIELDS = ['id', 'createdAt', 'updatedAt', 'isActive']

function isValidType(t: string): t is SettingsType {
  return t in SETTINGS_MAP
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPrismaModel(type: SettingsType): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[SETTINGS_MAP[type]]
}

async function fetchOrCreateSettings(type: SettingsType) {
  const model = getPrismaModel(type)
  const existing = await model.findFirst()
  return existing ?? (await model.create({ data: {} }))
}

async function upsertSettings(type: SettingsType, body: Record<string, unknown>) {
  const model = getPrismaModel(type)
  const data = Object.fromEntries(
    Object.entries(body).filter(([k]) => !FORBIDDEN_FIELDS.includes(k))
  )
  const existing = await model.findFirst()
  if (!existing) return model.create({ data })
  return model.update({ where: { id: existing.id }, data })
}

// ── GET /api/admin/settings/[type] ────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { type } = await params
  if (!isValidType(type)) {
    return NextResponse.json(
      { success: false, error: 'Tipo de configuración inválido' },
      { status: 400 }
    )
  }
  try {
    const settings = await fetchOrCreateSettings(type)
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    logger.error(`[settings/${type}] GET error`, { error })
    return NextResponse.json(
      { success: false, error: 'Error al obtener configuración' },
      { status: 500 }
    )
  }
}

// ── PATCH /api/admin/settings/[type] ─────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { type } = await params
  if (!isValidType(type)) {
    return NextResponse.json(
      { success: false, error: 'Tipo de configuración inválido' },
      { status: 400 }
    )
  }
  try {
    const body = (await req.json()) as Record<string, unknown>
    const settings = await upsertSettings(type, body)
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    logger.error(`[settings/${type}] PATCH error`, { error })
    return NextResponse.json(
      { success: false, error: 'Error al guardar configuración' },
      { status: 500 }
    )
  }
}

