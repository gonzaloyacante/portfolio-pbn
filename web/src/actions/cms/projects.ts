'use server'

import { logger } from '@/lib/logger'
/**
 * Server Actions optimizadas para proyectos
 * Con paginación, queries eficientes y caché
 */

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
      logger.error('Error al obtener proyectos paginados:', { error: error })
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
 * Obtener proyectos destacados para la home (cached)
 */
export const getFeaturedProjects = unstable_cache(
  async (count: number = 6) => {
    try {
      return await prisma.project.findMany({
        where: {
          isActive: true,
          isDeleted: false,
        },
        take: count,
        orderBy: { date: 'desc' },
        include: {
          category: true,
        },
      })
    } catch {
      return []
    }
  },
  [CACHE_TAGS.featuredProjects],
  {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: [CACHE_TAGS.featuredProjects, CACHE_TAGS.projects],
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
    logger.error('Error al obtener proyectos por categoría:', { error: error })
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
            excerpt: true,
            thumbnailUrl: true,
            videoUrl: true,
            date: true,
            duration: true,
            client: true,
            location: true,
            tags: true,
            // SEO
            metaTitle: true,
            metaDescription: true,
            metaKeywords: true,
            ogImage: true,
            canonicalUrl: true,
            // Header
            layout: true,
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
        logger.error('Error al obtener proyecto:', { error: error })
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
    logger.error('Error al obtener proyectos relacionados:', { error: error })
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
    logger.error('Error fetching adjacent projects:', { error: error })
    return { previous: null, next: null }
  }
}
