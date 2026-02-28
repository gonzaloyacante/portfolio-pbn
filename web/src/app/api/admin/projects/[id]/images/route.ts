/**
 * POST  /api/admin/projects/[id]/images  — Agregar imagen a un proyecto
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

const AddImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  order: z.number().int().min(0).default(0),
  alt: z.string().optional(),
  caption: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().optional(),
  bytes: z.number().int().positive().optional(),
  isCover: z.boolean().default(false),
})

// ── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id } = await params

    const project = await prisma.project.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    })

    if (!project) {
      return NextResponse.json({ success: false, error: 'Proyecto no encontrado' }, { status: 404 })
    }

    const body = await req.json()
    const parsed = AddImageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { url, publicId, order, alt, caption, width, height, format, bytes, isCover } =
      parsed.data

    // Si esta imagen es portada, desmarcar la existente
    if (isCover) {
      await prisma.projectImage.updateMany({
        where: { projectId: id, isCover: true },
        data: { isCover: false },
      })
    }

    const image = await prisma.projectImage.create({
      data: {
        projectId: id,
        url,
        publicId,
        order,
        alt: alt ?? null,
        caption: caption ?? null,
        width: width ?? null,
        height: height ?? null,
        format: format ?? null,
        bytes: bytes ?? null,
        isCover,
      },
      select: { id: true, url: true, publicId: true, order: true, alt: true, isCover: true },
    })

    try {
      revalidatePath(ROUTES.public.projects)
      revalidatePath(`${ROUTES.admin.projects}/${id}`)
      revalidateTag(CACHE_TAGS.projects, 'max')
    } catch (revalErr) {
      logger.warn('[admin-project-images-post] Revalidation failed (data saved)', {
        error: revalErr instanceof Error ? revalErr.message : String(revalErr),
      })
    }

    return NextResponse.json({ success: true, data: image }, { status: 201 })
  } catch (err) {
    logger.error('[admin-project-images-post] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
