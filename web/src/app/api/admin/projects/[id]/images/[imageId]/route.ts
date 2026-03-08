/**
 * DELETE /api/admin/projects/[id]/images/[imageId]  — Eliminar imagen de un proyecto
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { deleteImage } from '@/lib/cloudinary'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

type Params = { params: Promise<{ id: string; imageId: string }> }

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: Request, { params }: Params) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  try {
    const { id, imageId } = await params

    const image = await prisma.projectImage.findFirst({
      where: { id: imageId, projectId: id },
      select: { id: true, publicId: true },
    })

    if (!image) {
      return NextResponse.json({ success: false, error: 'Imagen no encontrada' }, { status: 404 })
    }

    // Eliminar de DB
    await prisma.projectImage.delete({ where: { id: imageId } })

    // Recomputar thumbnail del proyecto: si la imagen borrada era la miniatura,
    // elegir la siguiente imagen (preferir isCover, luego menor order)
    try {
      const nextImage = await prisma.projectImage.findFirst({
        where: { projectId: id },
        orderBy: [{ isCover: 'desc' as const }, { order: 'asc' as const }],
        select: { url: true, isCover: true },
      })

      if (nextImage) {
        await prisma.project.update({ where: { id }, data: { thumbnailUrl: nextImage.url } })
      } else {
        // Project thumbnail is stored as an empty string when not set
        await prisma.project.update({ where: { id }, data: { thumbnailUrl: '' } })
      }
    } catch (updateErr) {
      logger.warn('[admin-project-images-delete] Could not recompute project.thumbnailUrl', {
        error: updateErr instanceof Error ? updateErr.message : String(updateErr),
      })
    }

    revalidatePath(ROUTES.public.projects, 'layout')
    revalidatePath(`${ROUTES.admin.projects}/${id}`)
    revalidateTag(CACHE_TAGS.projects, 'max')
    revalidateTag(CACHE_TAGS.featuredProjects, 'max')

    // Eliminar de Cloudinary (no bloqueante — si falla no afecta la respuesta)
    if (image.publicId) {
      deleteImage(image.publicId).catch((err: Error) => {
        logger.warn('[admin-project-images-delete] Cloudinary delete failed', {
          publicId: image.publicId,
          error: err.message,
        })
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('[admin-project-images-delete] Error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
