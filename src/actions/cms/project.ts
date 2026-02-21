'use server'

import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'

interface ActionResult {
  success: boolean
  error?: string
}

/**
 * Reorder projects by updating their sortOrder
 */
export async function reorderProjects(projectIds: string[]): Promise<void> {
  await requireAdmin()
  await checkApiRateLimit()
  await Promise.all(
    projectIds.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  )
  revalidatePath(ROUTES.admin.projects)
}

/**
 * Set a project's thumbnail from its existing images
 */
export async function setProjectThumbnail(
  projectId: string,
  thumbnailUrl: string
): Promise<ActionResult> {
  await requireAdmin()
  await checkApiRateLimit()

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { thumbnailUrl },
    })
    revalidatePath(`${ROUTES.admin.projects}/${projectId}/editar`)
    revalidatePath(ROUTES.admin.projects)
    return { success: true }
  } catch (err) {
    logger.error('Error setting thumbnail:', { error: err })
    return { success: false, error: 'Error al cambiar thumbnail' }
  }
}

/**
 * Delete a project (soft delete)
 */
export async function deleteProjectAction(projectId: string): Promise<void> {
  await requireAdmin()
  await checkApiRateLimit()
  await prisma.project.update({
    where: { id: projectId },
    data: { isDeleted: true, deletedAt: new Date() },
  })
  revalidatePath(ROUTES.admin.projects)
}
