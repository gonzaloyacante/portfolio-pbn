import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { ROUTES } from '@/config/routes'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { prisma } from '@/lib/db'
import { withAdminJwt } from '@/lib/jwt-admin'
import { logger } from '@/lib/logger'

const VALID_TYPES = ['project', 'category', 'service', 'testimonial', 'contact', 'booking'] as const
type TrashType = (typeof VALID_TYPES)[number]

function isValidType(t: string): t is TrashType {
  return VALID_TYPES.includes(t as TrashType)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModel(type: TrashType): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[type]
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

  // Para category y service aplicamos un-mangle del slug
  const updateData: Record<string, unknown> = { deletedAt: null }
  if ((type === 'category' || type === 'service') && item.slug) {
    updateData.slug = await unmangleSlug(model, item.slug as string, id)
  }

  return model.update({ where: { id }, data: updateData })
}

async function purgeItem(type: TrashType, id: string) {
  const model = getModel(type)
  const item = await model.findFirst({ where: { id, deletedAt: { not: null } } })
  if (!item) return null
  return model.delete({ where: { id } })
}

/** Invalidate caches for the given entity type */
function revalidateForType(type: TrashType) {
  revalidatePath(ROUTES.admin.trash)
  switch (type) {
    case 'project':
      revalidatePath(ROUTES.public.projects)
      revalidatePath(ROUTES.admin.projects)
      revalidatePath(ROUTES.home, 'layout')
      revalidateTag(CACHE_TAGS.projects, 'max')
      revalidateTag(CACHE_TAGS.featuredProjects, 'max')
      break
    case 'category':
      revalidatePath(ROUTES.public.projects)
      revalidatePath(ROUTES.admin.categories)
      revalidateTag(CACHE_TAGS.categories, 'max')
      break
    case 'service':
      revalidatePath(ROUTES.public.services)
      revalidatePath(ROUTES.admin.services)
      revalidateTag(CACHE_TAGS.services, 'max')
      break
    case 'testimonial':
      revalidatePath(ROUTES.home)
      revalidatePath(ROUTES.public.about)
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
