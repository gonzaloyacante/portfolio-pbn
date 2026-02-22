import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'

type SocialLinkBody = {
  platform: string
  url: string
  username?: string
  icon?: string
  isActive?: boolean
  sortOrder?: number
}

async function saveSocialLink(body: SocialLinkBody) {
  const { platform, url, username, icon, isActive, sortOrder } = body
  return prisma.socialLink.upsert({
    where: { platform },
    create: { platform, url, username, icon, isActive: isActive ?? true, sortOrder: sortOrder ?? 0 },
    update: { url, username, icon, isActive: isActive ?? true, sortOrder: sortOrder ?? 0 },
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
    console.error('[settings/social] GET error:', error)
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
    console.error('[settings/social] POST error:', error)
    return NextResponse.json({ success: false, error: 'Error al guardar red social' }, { status: 500 })
  }
}
