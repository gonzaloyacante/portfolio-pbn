/**
 * Server Actions optimizadas para proyectos
 * Con paginación, queries eficientes y caché
 */

'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { ROUTES } from '@/config/routes'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'

/**
 * Obtener proyectos con paginación (cached)
 */
export const getPaginatedProjects = unstable_cache(
  async (page: number = 1, limit: number = 12) => {
    const skip = (page - 1) * limit

    try {
      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where: {
            isActive: true,
            isDeleted: false,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnailUrl: true,
            date: true,
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
          take: limit,
          skip,
        }),
        prisma.project.count({
          where: {
            isActive: true,
            isDeleted: false,
          },
        }),
      ])

      return {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + projects.length < total,
        },
      }
    } catch (error) {
      console.error('Error al obtener proyectos paginados:', error)
      return {
        projects: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
          hasMore: false,
        },
      }
    }
  },
  [CACHE_TAGS.projects],
  {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: [CACHE_TAGS.projects],
  }
)

/**
 * Obtener proyectos por categoría con paginación
 */
export async function getProjectsByCategory(
  categorySlug: string,
  page: number = 1,
  limit: number = 12
) {
  const skip = (page - 1) * limit

  try {
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          isActive: true,
          isDeleted: false,
          category: {
            slug: categorySlug,
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          date: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        take: limit,
        skip,
      }),
      prisma.project.count({
        where: {
          isActive: true,
          isDeleted: false,
          category: {
            slug: categorySlug,
          },
        },
      }),
    ])

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + projects.length < total,
      },
    }
  } catch (error) {
    console.error('Error al obtener proyectos por categoría:', error)
    return {
      projects: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    }
  }
}

/**
 * Obtener proyecto individual (optimizado y cached)
 */
export async function getProjectBySlug(slug: string) {
  return unstable_cache(
    async () => {
      try {
        return await prisma.project.findUnique({
          where: { slug },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            thumbnailUrl: true,
            date: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            images: {
              select: {
                id: true,
                url: true,
                order: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
            updatedAt: true,
          },
        })
      } catch (error) {
        console.error('Error al obtener proyecto:', error)
        return null
      }
    },
    [CACHE_TAGS.projectBySlug(slug)],
    {
      revalidate: CACHE_DURATIONS.MEDIUM,
      tags: [CACHE_TAGS.projectBySlug(slug)],
    }
  )()
}

/**
 * Obtener proyectos relacionados (misma categoría, excluir actual)
 */
export async function getRelatedProjects(projectId: string, categoryId: string, limit: number = 3) {
  try {
    return await prisma.project.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        categoryId,
        id: {
          not: projectId,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnailUrl: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
    })
  } catch (error) {
    console.error('Error al obtener proyectos relacionados:', error)
    return []
  }
}

/**
 * Revalidar paths y tags de proyectos
 */
export async function revalidateProjects() {
  revalidatePath(ROUTES.public.projects)
  revalidatePath(ROUTES.home, 'layout')
  revalidateTag(CACHE_TAGS.projects, 'max')
  revalidateTag(CACHE_TAGS.featuredProjects, 'max')
}

/**
 * Restaurar proyecto eliminado
 */
export async function restoreProject(id: string) {
  try {
    await prisma.project.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    })
    revalidatePath(ROUTES.admin.trash)
    revalidatePath(ROUTES.admin.projects)
    return { success: true }
  } catch (error) {
    console.error('Error restaurando proyecto:', error)
    return { success: false, error: 'Error al restaurar proyecto' }
  }
}

/**
 * Eliminar proyecto permanentemente
 */
export async function permanentlyDeleteProject(id: string) {
  try {
    // Las imágenes se eliminan automáticamente con onDelete: Cascade
    await prisma.project.delete({ where: { id } })
    revalidatePath(ROUTES.admin.trash)
    return { success: true }
  } catch (error) {
    console.error('Error eliminando proyecto permanentemente:', error)
    return { success: false, error: 'Error al eliminar proyecto' }
  }
}

/**
 * Obtener proyectos adyacentes (circular/infinite loop)
 * Previous: Proyecto más nuevo (o el más viejo si no hay más nuevos)
 * Next: Proyecto más viejo (o el más nuevo si no hay más viejos)
 */
export async function getAdjacentProjects(currentProjectId: string, categoryId: string) {
  try {
    const currentProject = await prisma.project.findUnique({
      where: { id: currentProjectId },
      select: { date: true },
    })

    if (!currentProject) return { previous: null, next: null }

    const [previous, next, first, last] = await Promise.all([
      // Previous: Newer than current (date > current) -> Order by date ASC to get closest
      prisma.project.findFirst({
        where: {
          categoryId,
          isActive: true,
          isDeleted: false,
          date: { gt: currentProject.date },
        },
        orderBy: { date: 'asc' },
        select: { title: true, slug: true, thumbnailUrl: true },
      }),
      // Next: Older than current (date < current) -> Order by date DESC to get closest
      prisma.project.findFirst({
        where: {
          categoryId,
          isActive: true,
          isDeleted: false,
          date: { lt: currentProject.date },
        },
        orderBy: { date: 'desc' },
        select: { title: true, slug: true, thumbnailUrl: true },
      }),
      // First (Newest) - for wrapping
      prisma.project.findFirst({
        where: { categoryId, isActive: true, isDeleted: false },
        orderBy: { date: 'desc' },
        select: { title: true, slug: true, thumbnailUrl: true },
      }),
      // Last (Oldest) - for wrapping
      prisma.project.findFirst({
        where: { categoryId, isActive: true, isDeleted: false },
        orderBy: { date: 'asc' },
        select: { title: true, slug: true, thumbnailUrl: true },
      }),
    ])

    return {
      previous: previous || last, // If no newer (we are at start), wrap to oldest (last)
      next: next || first, // If no older (we are at end), wrap to newest (first)
    }
  } catch (error) {
    console.error('Error fetching adjacent projects:', error)
    return { previous: null, next: null }
  }
}
