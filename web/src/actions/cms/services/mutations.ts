'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'

import { revalidatePublicServices } from './form-helpers'

/**
 * Delete a service
 */
export async function deleteService(id: string) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  try {
    // Soft delete: marcar como eliminado y liberar slug único para reutilización
    const svc = await prisma.service.findUnique({
      where: { id },
      select: { slug: true, deletedAt: true },
    })
    if (!svc || svc.deletedAt !== null) {
      return { success: false, error: 'Servicio no encontrado' }
    }
    const mangledSlug = `${svc.slug}_deleted_${Date.now()}`
    await prisma.service.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, slug: mangledSlug },
    })

    revalidatePath(ROUTES.admin.services)
    revalidatePublicServices([svc?.slug])
    logger.info(`Service soft deleted: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting service:', { error })
    return { success: false, error: 'Error al eliminar el servicio' }
  }
}

/**
 * Toggle service active state
 */
export async function toggleService(id: string) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  try {
    const service = await prisma.service.findUnique({
      where: { id },
      select: { isActive: true, slug: true, deletedAt: true },
    })
    if (!service || service.deletedAt !== null) {
      return { success: false, error: 'Servicio no encontrado' }
    }

    await prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
    })

    revalidatePath(ROUTES.admin.services)
    revalidatePublicServices([service.slug])
    logger.info(`Service toggled: ${id} -> ${!service.isActive}`)
    return { success: true, isActive: !service.isActive }
  } catch (error) {
    logger.error('Error toggling service:', { error })
    return { success: false, error: 'Error al cambiar el estado del servicio' }
  }
}

/**
 * Reorder services
 */
export async function reorderServices(orderedIds: string[]) {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.service.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    )

    revalidatePath(ROUTES.admin.services)
    revalidatePublicServices()
    logger.info('Services reordered')
    return { success: true }
  } catch (error) {
    logger.error('Error reordering services:', { error })
    return { success: false, error: 'Error al reordenar los servicios' }
  }
}
