'use server'

import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'
import { checkApiRateLimit } from '@/lib/rate-limit-guards'

import { z } from 'zod'
import { deleteProject } from '@/actions/cms/content'

interface ActionResult {
  success: boolean
  error?: string
}

const ReorderProjectsSchema = z.array(z.string().cuid()).min(1)

/**
 * Reorder projects by updating their sortOrder
 */
export async function reorderProjects(projectIds: string[]): Promise<void> {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) throw new Error(rl.error)

  const parsed = ReorderProjectsSchema.safeParse(projectIds)
  if (!parsed.success) {
    throw new Error('IDs de proyecto inválidos')
  }

  await prisma.$transaction(
    parsed.data.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  )
  revalidatePath(ROUTES.admin.projects)
  revalidatePath(ROUTES.public.projects, 'layout')
  revalidateTag(CACHE_TAGS.projects, 'max')
  revalidateTag(CACHE_TAGS.categories, 'max')
}

/**
 * Set a project's thumbnail from its existing images
 */
export async function setProjectThumbnail(
  projectId: string,
  thumbnailUrl: string
): Promise<ActionResult> {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { thumbnailUrl },
    })
    revalidatePath(`${ROUTES.admin.projects}/${projectId}/editar`)
    revalidatePath(ROUTES.admin.projects)
    revalidatePath(ROUTES.public.projects, 'layout')
    revalidateTag(CACHE_TAGS.projects, 'max')
    revalidateTag(CACHE_TAGS.featuredProjects, 'max')
    return { success: true }
  } catch (err) {
    logger.error('Error setting thumbnail:', { error: err })
    return { success: false, error: 'Error al cambiar thumbnail' }
  }
}

/**
 * Delete a project (soft delete via core content function for proper slug mangling)
 */
export async function deleteProjectAction(projectId: string): Promise<void> {
  const result = await deleteProject(projectId)
  if (!result.success) {
    throw new Error(result.error)
  }
}

/**
 * Toggle project visibility (isActive)
 */
export async function toggleProjectActive(projectId: string): Promise<ActionResult> {
  await requireAdmin()
  const rl = await checkApiRateLimit()
  if (rl) return { success: false, error: rl.error }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { isActive: true },
    })

    if (!project) {
      return { success: false, error: 'Proyecto no encontrado' }
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { isActive: !project.isActive },
    })

    revalidatePath(ROUTES.admin.projects)
    revalidatePath(ROUTES.public.projects, 'layout')
    revalidateTag(CACHE_TAGS.projects, 'max')
    revalidateTag(CACHE_TAGS.featuredProjects, 'max')
    return { success: true }
  } catch (err) {
    logger.error('Error toggling project visibility:', { error: err })
    return { success: false, error: 'Error al cambiar visibilidad' }
  }
}
