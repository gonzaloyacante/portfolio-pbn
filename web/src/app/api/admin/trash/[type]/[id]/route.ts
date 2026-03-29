import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'
import { extractPublicIdUrl, deleteMultipleImages } from '@/lib/cloudinary'

const VALID_TYPES = ['project', 'category', 'service', 'testimonial', 'contact', 'booking'] as const
type TrashType = (typeof VALID_TYPES)[number]

function isValidType(t: string): t is TrashType {
  return VALID_TYPES.includes(t as TrashType)
}

type TrashItemModel = {
  findFirst(args: { where: Record<string, unknown> }): Promise<Record<string, unknown> | null>
  update(args: {
    where: Record<string, unknown>
    data: Record<string, unknown>
  }): Promise<Record<string, unknown>>
  delete(args: { where: Record<string, unknown> }): Promise<Record<string, unknown>>
}

const TRASH_MODELS: Record<TrashType, TrashItemModel> = {
  project: prisma.project as unknown as TrashItemModel,
  category: prisma.category as unknown as TrashItemModel,
  service: prisma.service as unknown as TrashItemModel,
  testimonial: prisma.testimonial as unknown as TrashItemModel,
  contact: prisma.contact as unknown as TrashItemModel,
  booking: prisma.booking as unknown as TrashItemModel,
}

function getModel(type: TrashType): TrashItemModel {
  return TRASH_MODELS[type]
}

/** Deshace el mangle del slug aplicado en el soft-delete.
 *  Si el slug original ya está en uso, devuelve un slug único agregando sufijo. */
async function unmangleSlug(
  model: ReturnType<typeof getModel>,
  currentSlug: string,
  currentId: string
): Promise<string> {
  // El mangle tiene el patrón: `<original>_deleted_<timestamp>`
  const match = /^(.+)_deleted_\d+$/.exec(currentSlug)
  if (!match) return currentSlug // No fue mangleado, devolver tal cual

  const originalSlug = match[1]
  const taken = await model.findFirst({ where: { slug: originalSlug, NOT: { id: currentId } } })
  if (!taken) return originalSlug

  // El slug original fue tomado por otro — intentar variante numérica
  for (let i = 2; i <= 20; i++) {
    const candidate = `${originalSlug}-${i}`
    const takenAlt = await model.findFirst({ where: { slug: candidate, NOT: { id: currentId } } })
    if (!takenAlt) return candidate
  }
  // Fallback: timestamp corto
  return `${originalSlug}-${Date.now().toString(36)}`
}

async function restoreItem(type: TrashType, id: string) {
  const model = getModel(type)
  const item = await model.findFirst({ where: { id, deletedAt: { not: null } } })
  if (!item) return null

  const updateData: Record<string, unknown> = { deletedAt: null }

  // Los proyectos usan isDeleted (bool) además de deletedAt — hay que restaurar ambos
  if (type === 'project') {
    updateData.isDeleted = false
  }

  // project, category y service tienen isActive — restaurar a true
  if (type === 'project' || type === 'category' || type === 'service') {
    updateData.isActive = true
  }

  // Para project, category y service aplicamos un-mangle del slug mangleado al borrar
  if ((type === 'project' || type === 'category' || type === 'service') && item.slug) {
    updateData.slug = await unmangleSlug(model, item.slug as string, id)
  }

  return model.update({ where: { id }, data: updateData })
}

async function purgeItem(type: TrashType, id: string) {
  const model = getModel(type)
  const publicIdsToDelete: string[] = []

  // Pre-fetch dependencias ricas en media antes de borrarlas para recolectar sus assets huérfanos
  if (type === 'project') {
    const project = await prisma.project.findFirst({
      where: { id, deletedAt: { not: null } },
      include: { images: true },
    })
    if (!project) return null
    if (project.thumbnailUrl) {
      const pid = extractPublicIdUrl(project.thumbnailUrl)
      if (pid) publicIdsToDelete.push(pid)
    }
    project.images.forEach((img) => publicIdsToDelete.push(img.publicId))
  } else if (type === 'category') {
    const category = await prisma.category.findFirst({
      where: { id, deletedAt: { not: null } },
      include: {
        projects: {
          include: { images: true },
        },
      },
    })
    if (!category) return null

    // 1. Category's own cover or thumbnail (they share fields occasionally or use cover)
    if (category.coverImageUrl) {
      const pid = extractPublicIdUrl(category.coverImageUrl)
      if (pid) publicIdsToDelete.push(pid)
    }
    if (category.thumbnailUrl) {
      const pid = extractPublicIdUrl(category.thumbnailUrl)
      if (pid) publicIdsToDelete.push(pid)
    }

    // 2. All child projects that will be cascade-deleted
    for (const project of category.projects) {
      if (project.thumbnailUrl) {
        const pid = extractPublicIdUrl(project.thumbnailUrl)
        if (pid) publicIdsToDelete.push(pid)
      }
      project.images.forEach((img) => publicIdsToDelete.push(img.publicId))
    }
  } else if (type === 'service') {
    const service = await prisma.service.findFirst({
      where: { id, deletedAt: { not: null } },
    })
    if (!service) return null
    if (service.imageUrl) {
      const pid = extractPublicIdUrl(service.imageUrl)
      if (pid) publicIdsToDelete.push(pid)
    }
    for (const url of service.galleryUrls) {
      const pid = extractPublicIdUrl(url)
      if (pid) publicIdsToDelete.push(pid)
    }
  } else {
    const item = await model.findFirst({ where: { id, deletedAt: { not: null } } })
    if (!item) return null
  }

  // 1. Borrar registro central de la base de datos
  const result = await model.delete({ where: { id } })

  // 2. Ejecutar limpieza de Cloudinary no-bloqueante para evitar memory leaks cósmicos
  if (publicIdsToDelete.length > 0) {
    deleteMultipleImages(publicIdsToDelete).catch((err) => {
      logger.error('[trash] Error sweeping Cloudinary images for purged item', {
        type,
        id,
        error: err instanceof Error ? err.message : String(err),
      })
    })
  }

  return result
}

/** Invalidate caches for the given entity type */
function revalidateForType(type: TrashType) {
  revalidatePath(ROUTES.admin.trash)
  switch (type) {
    case 'project':
      revalidatePath(ROUTES.public.projects, 'layout')
      revalidatePath(ROUTES.admin.projects)
      revalidatePath(ROUTES.home)
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidateTag(CACHE_TAGS.featuredProjects, 'max')
      break
    case 'category':
      revalidatePath(ROUTES.public.projects, 'layout')
      revalidatePath(ROUTES.admin.categories)
      revalidateTag(CACHE_TAGS.categories, 'max')
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidateTag(CACHE_TAGS.featuredProjects, 'max')
      break
    case 'service':
      revalidatePath(ROUTES.public.services, 'layout')
      revalidatePath(ROUTES.admin.services)
      revalidateTag(CACHE_TAGS.services, 'max')
      break
    case 'testimonial':
      revalidatePath(ROUTES.home)
      revalidatePath(ROUTES.public.about, 'layout')
      revalidatePath(ROUTES.admin.testimonials)
      revalidateTag(CACHE_TAGS.testimonials, 'max')
      break
    case 'contact':
      revalidatePath(ROUTES.admin.contacts)
      break
    case 'booking':
      revalidatePath(ROUTES.admin.calendar)
      break
  }
}

// ── PATCH /api/admin/trash/[type]/[id] — Restaurar ───────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { type, id } = await params
  if (!isValidType(type)) {
    return NextResponse.json({ success: false, error: 'Tipo inválido' }, { status: 400 })
  }

  try {
    const item = await restoreItem(type, id)
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Elemento no encontrado en papelera' },
        { status: 404 }
      )
    }
    revalidateForType(type)
    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    logger.error(`[trash] PATCH ${type}/${id} error`, { error })
    return NextResponse.json({ success: false, error: 'Error al restaurar' }, { status: 500 })
  }
}

// ── DELETE /api/admin/trash/[type]/[id] — Eliminar permanentemente ────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const auth = await withAdminJwt(req)
  if (!auth.ok) return auth.response

  const { type, id } = await params
  if (!isValidType(type)) {
    return NextResponse.json({ success: false, error: 'Tipo inválido' }, { status: 400 })
  }

  try {
    const item = await purgeItem(type, id)
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Elemento no encontrado en papelera' },
        { status: 404 }
      )
    }
    revalidateForType(type)
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error(`[trash] DELETE ${type}/${id} error`, { error })
    return NextResponse.json({ success: false, error: 'Error al eliminar' }, { status: 500 })
  }
}
