/**
 * PUT /api/admin/projects/[id]/images/reorder
 * Reordena las imágenes de la galería de un proyecto.
 * Body: { items: [{ id: string, order: number }] }
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

type Params = { params: Promise<{ id: string }> }

const ReorderImagesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().cuid(),
        order: z.number().int().min(0),
      })
    )
    .min(1),
})

// ── PUT ──────────────────────────────────────────────────────────────────────

export async function PUT(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id } = await params

    const project = await prisma.project.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const parsed = ReorderImagesSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { items } = parsed.data

    await prisma.$transaction(
      items.map(({ id: imageId, order }) =>
        prisma.projectImage.update({
          where: { id: imageId },
          data: { order },
        })
      )
    )

    try {
      revalidateTag(CACHE_TAGS.project(id), 'max')
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidatePath(ROUTES.public.projects, 'layout')
    } catch {
      // revalidation best-effort
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('[admin-project-images-reorder] Error', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
