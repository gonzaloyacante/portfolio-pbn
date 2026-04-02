import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import {
  homeSettingsSchema,
  aboutSettingsSchema,
  contactSettingsSchema,
  themeEditorSchema,
  testimonialSettingsSchema,
  categorySettingsSchema,
} from '@/lib/validations'
import type { ZodSchema, ZodObject, ZodRawShape } from 'zod'

// ── Mapa de tipo → modelo Prisma ──────────────────────────────────────────────
type SettingsModel = {
  findFirst(): Promise<Record<string, unknown> | null>
  create(args: { data: Record<string, unknown> }): Promise<Record<string, unknown>>
  update(args: {
    where: Record<string, unknown>
    data: Record<string, unknown>
  }): Promise<Record<string, unknown>>
}

const SETTINGS_MODELS = {
  home: prisma.homeSettings as unknown as SettingsModel,
  about: prisma.aboutSettings as unknown as SettingsModel,
  contact: prisma.contactSettings as unknown as SettingsModel,
  theme: prisma.themeSettings as unknown as SettingsModel,
  site: prisma.siteSettings as unknown as SettingsModel,
  testimonial: prisma.testimonialSettings as unknown as SettingsModel,
  category: prisma.categorySettings as unknown as SettingsModel,
} satisfies Record<string, SettingsModel>

type SettingsType = keyof typeof SETTINGS_MODELS

// Mapa de tipo → Zod schema (site no tiene schema propio, pasa sin validar)
const SETTINGS_SCHEMA_MAP: Partial<Record<SettingsType, ZodSchema>> = {
  home: homeSettingsSchema,
  about: aboutSettingsSchema,
  contact: contactSettingsSchema,
  theme: themeEditorSchema,
  testimonial: testimonialSettingsSchema,
  category: categorySettingsSchema,
}

// Campos que nunca se actualizan desde la app
const FORBIDDEN_FIELDS = ['id', 'createdAt', 'updatedAt', 'isActive']

function isValidType(t: string): t is SettingsType {
  return t in SETTINGS_MODELS
}

function getPrismaModel(type: SettingsType): SettingsModel {
  return SETTINGS_MODELS[type]
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
export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
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
export async function PATCH(req: Request, { params }: { params: Promise<{ type: string }> }) {
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
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Body JSON inválido' }, { status: 400 })
    }

    // Validate with type-specific Zod schema (partial for PATCH semantics)
    const schema = SETTINGS_SCHEMA_MAP[type]
    let validatedBody: Record<string, unknown> = body as Record<string, unknown>
    if (schema) {
      const partialSchema =
        'partial' in schema ? (schema as ZodObject<ZodRawShape>).partial() : schema
      const parsed = partialSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      validatedBody = parsed.data as Record<string, unknown>
    }

    const settings = await upsertSettings(type, validatedBody)

    // Invalidate caches by settings type
    switch (type) {
      case 'home':
        revalidatePath(ROUTES.home)
        revalidateTag(CACHE_TAGS.homeSettings, 'max')
        break
      case 'about':
        revalidatePath(ROUTES.public.about, 'layout')
        revalidateTag(CACHE_TAGS.aboutSettings, 'max')
        break
      case 'contact':
        // contact settings (ownerName) render in Navbar on ALL public pages
        revalidatePath('/', 'layout')
        revalidateTag(CACHE_TAGS.contactSettings, 'max')
        break
      case 'theme':
        // theme is consumed in root layout → must clear ALL routes
        revalidatePath('/', 'layout')
        revalidateTag(CACHE_TAGS.themeSettings, 'max')
        break
      case 'site':
        // page visibility is read in (public)/layout.tsx → all public pages affected
        revalidatePath('/', 'layout')
        revalidateTag(CACHE_TAGS.siteSettings, 'max')
        break
      case 'testimonial':
        revalidatePath(ROUTES.home)
        revalidatePath(ROUTES.public.about, 'layout')
        revalidateTag(CACHE_TAGS.testimonialSettings, 'max')
        break
      case 'category':
        revalidatePath(ROUTES.public.portfolio, 'layout')
        revalidatePath(ROUTES.admin.categories)
        revalidateTag(CACHE_TAGS.categorySettings, 'max')
        break
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    logger.error(`[settings/${type}] PATCH error`, { error })
    return NextResponse.json(
      { success: false, error: 'Error al guardar configuración' },
      { status: 500 }
    )
  }
}
