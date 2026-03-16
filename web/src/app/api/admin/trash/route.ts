import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

const TRASH_TYPES = ['project', 'category', 'service', 'testimonial', 'contact', 'booking'] as const

type TrashType = (typeof TRASH_TYPES)[number]

type TrashModel = {
  findMany(args: {
    where: { deletedAt: unknown }
    orderBy?: Record<string, unknown>
    take?: number
  }): Promise<Record<string, unknown>[]>
}

const TRASH_MODELS: Record<TrashType, TrashModel> = {
  project: prisma.project as unknown as TrashModel,
  category: prisma.category as unknown as TrashModel,
  service: prisma.service as unknown as TrashModel,
  testimonial: prisma.testimonial as unknown as TrashModel,
  contact: prisma.contact as unknown as TrashModel,
  booking: prisma.booking as unknown as TrashModel,
}

function getModel(type: TrashType): TrashModel {
  return TRASH_MODELS[type]
}

async function fetchDeletedByType(type: TrashType) {
  const model = getModel(type)
  const items = await model.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
    take: 100,
  })
  return items.map((item: Record<string, unknown>) => ({ ...item, _type: type }))
}

// ── GET /api/admin/trash ──────────────────────────────────────────────────────
export async function GET(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const url = new URL(req.url)
    const typeFilter = url.searchParams.get('type') as TrashType | null

    const types = typeFilter && TRASH_TYPES.includes(typeFilter) ? [typeFilter] : [...TRASH_TYPES]

    const results = await Promise.all(types.map(fetchDeletedByType))
    const grouped = Object.fromEntries(types.map((type, i) => [type, results[i]]))
    const total = results.reduce((sum, items) => sum + items.length, 0)

    return NextResponse.json({ success: true, data: grouped, total })
  } catch (error) {
    logger.error('[trash] GET error', { error })
    return NextResponse.json(
      { success: false, error: 'Error al obtener papelera' },
      { status: 500 }
    )
  }
}
