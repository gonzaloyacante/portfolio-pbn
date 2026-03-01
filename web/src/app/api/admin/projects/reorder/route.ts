/**
 * POST /api/admin/projects/reorder
 * Reordenar proyectos (actualiza sortOrder de cada item).
 * Body: { items: [{ id: string, sortOrder: number }] }
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { items } = await req.json()

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'items debe ser un array no vacío' },
        { status: 400 }
      )
    }

    await prisma.$transaction(
      items.map(({ id, sortOrder }: { id: string; sortOrder: number }) =>
        prisma.project.update({
          where: { id },
          data: { sortOrder, updatedBy: auth.payload.userId },
        })
      )
    )

    try {
      revalidatePath(ROUTES.public.projects, 'layout')
      revalidatePath(ROUTES.admin.projects)
      revalidatePath(ROUTES.home, 'layout')
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidateTag(CACHE_TAGS.featuredProjects, 'max')
    } catch (revalErr) {
      logger.warn('[admin-projects-reorder] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, message: 'Orden actualizado' })
  } catch (err) {
    logger.error('[admin-projects-reorder] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
