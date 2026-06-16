import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { checkSettingsRateLimit } from '@/lib/rate-limit-guards'
import { socialLinkApiSchema } from '@/lib/validations'
import type { z } from 'zod'

type SocialLinkBody = z.infer<typeof socialLinkApiSchema>

function buildSocialData(body: SocialLinkBody) {
  return {
    url: body.url,
    username: body.username,
    icon: body.icon,
    isActive: body.isActive ?? true,
    sortOrder: body.sortOrder ?? 0,
  }
}

async function saveSocialLink(body: SocialLinkBody) {
  const data = buildSocialData(body)
  return prisma.socialLink.upsert({
    where: { platform: body.platform },
    create: { platform: body.platform, ...data },
    update: data,
  })
}

// ── GET /api/admin/settings/social ───────────────────────────────────────────
export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const links = await prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ success: true, data: links })
  } catch (error) {
    logger.error('[settings/social] GET error', { error })
    return NextResponse.json(
      { success: false, error: 'Error al obtener redes sociales' },
      { status: 500 }
    )
  }
}

// ── DELETE /api/admin/settings/social ───────────────────────────────────────
export async function DELETE(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    await checkSettingsRateLimit(auth.payload.userId)

    const body = (await req.json().catch(() => null)) as { id?: string; platform?: string } | null
    const id = body?.id?.trim()
    const platform = body?.platform?.trim()

    if (!id && !platform) {
      return NextResponse.json(
        { success: false, error: 'Debes indicar id o platform' },
        { status: 400 }
      )
    }

    const deleted = await prisma.socialLink.deleteMany({
      where: id ? { id } : { platform: platform! },
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { success: false, error: 'Red social no encontrada' },
        { status: 404 }
      )
    }

    revalidatePath(ROUTES.public.contact)
    revalidateTag(CACHE_TAGS.socialLinks, 'max')

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('[settings/social] DELETE error', { error })
    return NextResponse.json(
      { success: false, error: 'Error al eliminar red social' },
      { status: 500 }
    )
  }
}

// ── POST /api/admin/settings/social ──────────────────────────────────────────
export async function POST(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    await checkSettingsRateLimit(auth.payload.userId)

    const body = await req.json().catch(() => null)
    const parsed = socialLinkApiSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const link = await saveSocialLink(parsed.data)

    // social links only appear on /contacto page (not in any shared layout)
    revalidatePath(ROUTES.public.contact)
    revalidateTag(CACHE_TAGS.socialLinks, 'max')

    return NextResponse.json({ success: true, data: link }, { status: 201 })
  } catch (error) {
    logger.error('[settings/social] POST error', { error })
    return NextResponse.json(
      { success: false, error: 'Error al guardar red social' },
      { status: 500 }
    )
  }
}
