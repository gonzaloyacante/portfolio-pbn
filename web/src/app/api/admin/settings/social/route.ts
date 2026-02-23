import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

type SocialLinkBody = {
  platform: string
  url: string
  username?: string
  icon?: string
  isActive?: boolean
  sortOrder?: number
}

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
    return NextResponse.json({ success: false, error: 'Error al obtener redes sociales' }, { status: 500 })
  }
}

// ── POST /api/admin/settings/social ──────────────────────────────────────────
export async function POST(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const body = (await req.json()) as SocialLinkBody
    if (!body.platform || !body.url) {
      return NextResponse.json({ success: false, error: 'platform y url son obligatorios' }, { status: 400 })
    }
    const link = await saveSocialLink(body)
    return NextResponse.json({ success: true, data: link }, { status: 201 })
  } catch (error) {
    logger.error('[settings/social] POST error', { error })
    return NextResponse.json({ success: false, error: 'Error al guardar red social' }, { status: 500 })
  }
}
